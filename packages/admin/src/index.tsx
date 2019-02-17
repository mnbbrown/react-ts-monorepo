import React from 'react';
import ReactDOM from 'react-dom';
import { CONFIG } from '@react-ts-monorepo/common/config'

ReactDOM.render(<div>{JSON.stringify(CONFIG)}</div>, document.getElementById('root'));
