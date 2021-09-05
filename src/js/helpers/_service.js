import {$dom} from "./dom";
import {$data} from "./data";
import {$events} from "./events";
import {$style} from "./style";
import {$ui} from "./ui";
import variables from "../variables";
import is from 'is_js';

const APIName = variables.$EXTERNAL_API_NAME;

window[APIName] = {};

[
  {
    name: 'dom',
    value: $dom
  },
  {
    name: 'data',
    value: $data
  },
  {
    name: 'is',
    value: is
  },
  {
    name: 'events',
    value: $events
  },
  {
    name: 'style',
    value: $style
  },
  {
    name: 'ui',
    value: $ui
  }
]
  .forEach(item => window[APIName][item.name] = item.value);
