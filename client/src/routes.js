import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import Landing from './components/Landing/Landing';
import Survey from './components/Survey/Survey';


const Greeting = () => (
	<div>Hey there</div>
)

export default (
		<div>
			<Route path='/' component={App}>
				<IndexRoute component={Landing} />
				<Route path='survey' component={Survey} />
				<Route path='greet2' component={Greeting} />
				<Route path='greet3' component={Greeting} />
			</Route>
		
		</div>

)