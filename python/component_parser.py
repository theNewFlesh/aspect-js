import os
import re
from itertools import takewhile
from collections import defaultdict
import pandas as pd
from pandas import DataFrame
from pyparsing import Group, Or, Regex, delimitedList, Optional, Suppress, ZeroOrMore
# ------------------------------------------------------------------------------

def try_(func, item):
    try:
        return func(item)
    except:
        return ''
# ------------------------------------------------------------------------------

def component_to_dataframe(fullpath):
    with open(fullpath) as f:
        data = f.readlines()
    data = DataFrame(data, columns=['text'])
    data.text = data.text.apply(lambda x: x.strip('\n'))
    data['content'] = data.text.apply(parse_line)
    data = data[data.content != {}]

    start = data.content.apply(lambda x: x['content_type'] == 'script_start')
    start = data[start].index.item()

    stop = data.content.apply(lambda x: x['content_type'] == 'script_stop')
    stop = data[stop].index.item()

    data = data.ix[start:stop]
    data['content_type'] = data.content.apply(lambda x: x['content_type'])
    data['content'] = data.content.apply(lambda x: x['content'])

    return data

def _merge_content_types(row):
    row.content['content_type'] = row.content_type
    return row.content

def merge_dicts(dicts):
    assert(isinstance(dicts, list))

    output = defaultdict(lambda: [])
    for d in dicts:
        assert(isinstance(d, dict))

        for key, val in d.items():
            output[key].append(val)

    for key, val in output.items():
        v = val
        if len(val) > 0:
            if not isinstance(val[0], list) and not isinstance(val[0], dict):
                v = list(set(val))
                if len(v) == 1:
                    v = v[0]
        output[key] = v

    output = dict(output)
    return output

def _merge_content(items):
    output = merge_dicts(items)
    ctype = output['content_type']

    if 'description' in output.keys():
        if isinstance(output['description'], list):
            output['description'] = '\n'.join(output['description'])

    if 'parameters' in output.keys() and len(output['parameters']) > 0:
        if 'params' in output.keys() and len(output['params']) > 0:
            a = DataFrame(output['params'])
            b = DataFrame(output['parameters'][0])
            df = None
            flag = True
            try:
                df = pd.merge(a, b, on='name')
            except:
                flag = False

            if flag:
                df = df.apply(lambda row: dict(zip(
                    df.columns,
                    row.tolist()
                )), axis=1).tolist()
                params = []
                for item in df:
                    tmp = {}
                    for k, v in item.items():
                        if v != pd.np.nan:
                            tmp[k] = v
                    params.append(tmp)
                output['parameters'] = params
                del output['params']


    template = {
        # 'content_type': None,
        # 'member_type':  None,
        'description':    None,
        'name':           None,
        'parameters':     None,
        'params':         None,
        'parent_class':   None,
        'permission':     None,
        'returns':        None,
        'type':           None
    }
    template.update(output)
    output = template

    output['member_type'] = None
    if isinstance(ctype, list):
        ctype = list(filter(lambda x: x not in ['docline', 'decorator'], ctype))
        if len(ctype) > 0:
            output['member_type'] = ctype[-1]

    name = output['name']
    if isinstance(name, list) and len(name) > 0:
        name = filter(lambda x: x not in ['Component', 'Prop', 'Watch'], name)
        name = list(name)[0]
        output['name'] = name

    return output

def dataframe_to_list(data):
    # assign docstring identifiers
    mask = data.content_type.apply(lambda x: x in ['docstart', 'docstop'])
    temp = data[mask].index.tolist()
    id_ = 0
    data['id'] = pd.np.nan
    for i in range(0, len(temp), 2):
        data.loc[temp[i]: temp[i+1], 'id'] = id_
        id_ += 1

    # assign same id to adjacent methods and accessors
    data.id.ffill(inplace=True)
    data.tail(1).id = pd.np.nan

    ignore = [
        'script_start',
        'script_stop',
        'docstart',
        'docstop'
    ]
    mask = data.content_type.apply(lambda x: x not in ignore)

    # group by contiguos docstring and signature blocks
    data.content = data.apply(_merge_content_types, axis=1)
    data.dropna(inplace=True)
    data = data[mask].groupby('id')\
        .agg(lambda x: [x.content.tolist()])\
        .content.apply(_merge_content)
    data.reset_index(inplace=True, drop=True)
    data = data.tolist()

    return data
# ------------------------------------------------------------------------------

def parse_line(line):
    # generic terms
    _name_re = '[a-zA-Z_][a-zA-Z0-9_]*'
    name_re  = Regex(_name_re)
    perm     = Or(['public', 'private']).setResultsName('permission')
    name     = name_re.setResultsName('name')

    # script tags
    script_start = Regex('<script.*lang="ts">').setResultsName('script_start')
    script_stop  = Regex('</script>').setResultsName('script_stop')

    # interface
    interface = Group(Suppress('interface') + name).setResultsName('interface')

    # class
    ext    = Optional(Suppress('extends') + name_re.setResultsName('parent_class'))
    exp    = Optional(ZeroOrMore(Regex('export|default')))
    class_ = Suppress(exp) + Suppress('class') + name + ext + Suppress('{')

    # decorator
    decorator = Suppress('@') + name + Suppress(Optional(Regex("\(.*\)")))

    # method
    ptype  = name_re.setResultsName('type')
    dfal   = Regex('".*"|[.*]|{.*}|' + _name_re).setResultsName('default')
    rtype  = Optional(Suppress(':') + name_re.setResultsName('returns'))
    opt    = Optional(Suppress('=') + dfal)
    param  = Group(name + Suppress(':') + ptype + opt)
    params = delimitedList(param, delim=',').setResultsName('parameters')
    method = perm + name + Suppress('(') + Optional(params) + Suppress(')') + rtype + Suppress('{')

    # constructor
    constructor = perm + Regex("constructor") + Suppress('(') + Optional(params) + Suppress(')') + rtype + Suppress('{')

    # getter
    getter = perm + Suppress('get') + name + Suppress('()') + rtype + Suppress('{')

    # setter
    setter = perm + Suppress('set') + name + Suppress('(') + params + Suppress(')') + rtype + Suppress('{')

    # accessor
    atype = Optional(Suppress(':') + name_re.setResultsName('type'))
    value = Regex('.*').setResultsName('value')
    val = Optional(Suppress('=') + value)
    accessor = perm + name + atype + val + Suppress(';')

    # docstring start and stop
    docstart = Regex('/\*\*').setResultsName('docstart')
    docstop  = Regex('\*/').setResultsName('docstop')

    # line of docstring
    doc_com = Regex('\*(?!/)')
    name_re = Regex('[a-zA-Z_][a-zA-Z0-9_]*')
    desc    = Regex('.*').setResultsName('description')
    info    = doc_com + desc
    param   = Group(Suppress(doc_com) + Suppress('@param') + name + desc).setResultsName('params')
    returns = Regex('.*').setResultsName('returns')
    returns = doc_com + Regex('@returns?') + returns
    docline = returns | param | info

    parsers = [
        ('setter',       setter),
        ('method',       method),
        ('getter',       getter),
        ('constructor',  constructor),
        ('script_start', script_start),
        ('script_stop',  script_stop),
        ('interface',    interface),
        ('class',       class_),
        ('decorator',    decorator),
        ('docstart',     docstart),
        ('docstop',      docstop),
        ('docline',      docline),
        ('accessor',     accessor)
    ]

    result = {}
    for ctype, parser in parsers:
        try:
            result = {
                'content_type': ctype,
                'content': parser.parseString(line).asDict()
            }

            if result['content_type'] == 'method':
                params = result['content']['parameters']
                result['content']['parameters'] = [p.asDict() for p in params]

            break
        except:
            result = {}

    return result
# ------------------------------------------------------------------------------

def get_files(base):
    files = os.listdir(base)
    files = filter(lambda x: re.search('\.vue$', x), files)
    files = [os.path.join(base, x) for x in files]
    return files

def parse_component(fullpath):
    data = component_to_dataframe(fullpath)
    data = dataframe_to_list(data)
    return data

def parse_components(base):
    files = get_files(base)
    output = []
    for f in files:
        output.append(dict(
            content=parse_component(f),
            fullpath=f,
            name=os.path.splitext(os.path.split(f)[-1])[0]
        ))
    return output
# ------------------------------------------------------------------------------

__all__ = [
    'get_files',
    'component_to_dataframe',
    'dataframe_to_list',
    'parse_line',
    'parse_component',
    'parse_components'
]
