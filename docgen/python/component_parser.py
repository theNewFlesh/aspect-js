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

def get_files(base):
    files = os.listdir(base)
    files = filter(lambda x: re.search('\.vue$', x), files)
    files = [os.path.join(base, x) for x in files]
    return files

def component_to_dataframe(fullpath):
    with open(fullpath) as f:
        data = f.readlines()
    data = DataFrame(data, columns=['text'])
    data.text = data.text.apply(lambda x: x.strip('\n'))
    data['content'] = data.text.apply(parse_component)
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

    return data
# ------------------------------------------------------------------------------

def parse_component(line):
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
    ptype  = name_re.setResultsName('type_')
    dfal   = Regex('".*"|[.*]|{.*}|' + _name_re).setResultsName('default')
    rtype  = Optional(Suppress(':') + name_re.setResultsName('returns'))
    opt    = Optional(Suppress('=') + dfal)
    param  = name + Suppress(':') + ptype + opt
    params = delimitedList(param, delim=',').setResultsName('parameters')
    method = perm + name + Suppress('(') + Optional(params) + Suppress(')') + rtype + Suppress('{')

    # constructor
    constructor = perm + Regex("constructor") + Suppress('(') + Optional(params) + Suppress(')') + rtype + Suppress('{')

    # getter
    getter = perm + Suppress('get') + name + Suppress('()') + rtype + Suppress('{')

    # setter
    setter = perm + Suppress('set') + name + Suppress('(') + params + Suppress(')') + rtype + Suppress('{')

    # accessor
    atype = Optional(Suppress(':') + name_re.setResultsName('type_'))
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
        ('class_',       class_),
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

__all__ = [
    'try_',
    'get_files',
    'component_to_dataframe',
    'parse_component'
]
