import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import NavigationBar from './NavigationBar/NavigationBar'

export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider >
      	<div style={{ margin: 0 }}>
	      	<NavigationBar />
	      	{this.props.children}
	    </div>
      </MuiThemeProvider>
    );
  }
}
