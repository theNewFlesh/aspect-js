import os
import re
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
    
    start = data.content\
        .apply(lambda x: x['content_type'] == 'script_start')
    start = data[start].index.item()
    
    stop = data.content\
        .apply(lambda x: x['content_type'] == 'script_stop')
    stop = data[stop].index.item()
    
    data = data.ix[start:stop]
    data['content_type'] = data.content.apply(lambda x: x['content_type'])
    data['content'] = data.content.apply(lambda x: x['content'])

    return data

def _merge_content_types(row):
    row.content['content_type'] = row.content_type
    return row.content

def _merge_content(items):
    temp = {}
    for item in items:
        key = item['content_type']
        if not key in temp.keys():
            temp[key] = []
            
        tempitem = {}
        for k in filter(lambda x: x != 'content_type', item.keys()):
            tempitem[k] = item[k]
        temp[key].append(tempitem)

        temp['type'] = key
    
    output = {}
    for k, v in temp.items():
        if k == 'docline':
            output['params'] = list(filter(lambda x: 'param' in x.keys(), v))
            
            returns = list(filter(lambda x: 'returns' in x.keys(), v))
            output['returns'] = None
            if len(returns) > 0:
                output['returns'] = returns[0]
                
            extra = filter(lambda x: 'param' not in x.keys(), v)
            extra = filter(lambda x: 'returns' not in x.keys(), extra)
            desc = filter(lambda x: 'description' in x.keys(), extra)
            desc = [x['description'] for x in desc]
            desc = '\n'.join(desc)
            output['description'] = desc
            
            # extra = filter(lambda x: 'description' not in x.keys(), extra)
            # output['extra'] = list(extra)
            
        # elif k == 'method':
        #     output[k] = v[0]
            
        else:
            output[k] = v

    types = [
        'setter',
        'method',
        'getter',
        'constructor',
        'script_start',
        'script_stop',
        'interface',
        'class',
        'decorator',
        'docstart',
        'docstop',
        'docline',
        'accessor'
    ]
    for t in types:
        if t in output.keys():
            if len(output[t]) == 1:
                output[t] = output[t][0]
        
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
    decorator = Suppress('@') + name

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
    param   = name_re.setResultsName('param')
    param   = doc_com + '@param' + param + desc
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
            pass

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
