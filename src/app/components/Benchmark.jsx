import React from 'react';
import { Link } from 'react-router-dom';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { List, ListItem } from 'material-ui/List';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

class Benchmark extends React.Component {
  constructor() {
    super();
    this.state = {
      config: {
        broker: 'tcp://10.0.14.106:1883',
        endEventName: 'TemperatureEndEvent',
        events: [
          {
            name: 'TemperatureEvent',
            properties: [
              {
                name: 'temperature',
                type: 'int'
              }
            ]
          }
        ],
        statements: [
          {
            name: 'AverageTemperature',
            query:
              'select avg(temperature) from TemperatureEvent.win:time_batch(5 sec)'
          }
        ]
      }
    };

    this.addStatement = this.addStatement.bind(this);
    this.addEvent = this.addEvent.bind(this);
  }

  handleChange(name, event) {
    const value = event.target.value;
    this.setState(state => {
      var newState = { ...state };
      newState.config[name] = value;
      return newState;
    });
  }

  handleChangeList(listName, name, index, event) {
    const value = event.target.value;
    this.setState(state => {
      var newState = { ...state };
      newState.config[listName][index][name] = value;
      return newState;
    });
  }

  handleChangeEventPropertyName(eventIndex, propertyIndex, event) {
    const value = event.target.value;
    this.setState(state => {
      var newState = { ...state };
      newState.config.events[eventIndex].properties[propertyIndex].name = value;
      return newState;
    });
  }

  handleChangeEventPropertyType(
    eventIndex,
    propertyIndex,
    event,
    index,
    value
  ) {
    this.setState(state => {
      var newState = { ...state };
      newState.config.events[eventIndex].properties[propertyIndex].type = value;
      return newState;
    });
  }

  addEvent() {
    this.setState(state => {
      var newState = { ...state };
      newState.config.events.push({
        name: '',
        properties: [{ name: '', type: 'string' }]
      });
      return newState;
    });
  }

  addEventProperty(index) {
    this.setState(state => {
      var newState = { ...state };
      newState.config.events[index].properties.push({
        name: '',
        type: 'string'
      });
      return newState;
    });
  }

  addStatement() {
    this.setState(state => {
      var newState = { ...state };
      newState.config.statements.push({ name: '', query: '' });
      return newState;
    });
  }

  getStyle() {
    return {
      root: {
        display: 'flex',
        flexDirection: 'column',
        margin: '0 auto',
        padding: '24px',
        minWidth: '40%'
      },
      child: {
        margin: 'auto'
      }
    };
  }

  render() {
    const style = this.getStyle();
    return (
      <Paper style={style.root}>
        <h1>
          {'Benchmark configuration'}
        </h1>
        <TextField
          floatingLabelText="MQTT broker"
          floatingLabelFixed={true}
          value={this.state.config.broker}
          onChange={this.handleChange.bind(this, 'broker')}
        />
        <TextField
          floatingLabelText="End benchmark topic name"
          floatingLabelFixed={true}
          value={this.state.config.endEventName}
          onChange={this.handleChange.bind(this, 'endEventName')}
        />
        <List>
          <Subheader>
            {'Events'}
          </Subheader>
          {this.state.config.events.map((event, eventIndex) =>
            <ListItem key={eventIndex} disabled={true}>
              <TextField
                floatingLabelText="Event name"
                value={event.name}
                onChange={this.handleChangeList.bind(
                  this,
                  'events',
                  'name',
                  eventIndex
                )}
              />
              {event.properties.map((property, propertyIndex) =>
                <ListItem key={propertyIndex} disabled={true}>
                  <TextField
                    floatingLabelText="Property name"
                    value={property.name}
                    onChange={this.handleChangeEventPropertyName.bind(
                      this,
                      eventIndex,
                      propertyIndex
                    )}
                  />
                  <SelectField
                    floatingLabelText="Property type"
                    value={property.type}
                    onChange={this.handleChangeEventPropertyType.bind(
                      this,
                      eventIndex,
                      propertyIndex
                    )}
                  >
                    <MenuItem value={'string'} primaryText="String" />
                    <MenuItem value={'int'} primaryText="Integer" />
                    <MenuItem value={'long'} primaryText="Long" />
                    <MenuItem value={'boolean'} primaryText="Boolean" />
                    <MenuItem value={'double'} primaryText="Double" />
                    <MenuItem value={'float'} primaryText="Float" />
                    <MenuItem value={'short'} primaryText="Short" />
                    <MenuItem value={'char'} primaryText="Char" />
                    <MenuItem value={'byte'} primaryText="Byte" />
                  </SelectField>
                </ListItem>
              )}
              <ListItem
                primaryText="Add new event property"
                leftIcon={<ContentAdd />}
                onClick={this.addEventProperty.bind(this, eventIndex)}
              />
            </ListItem>
          )}
          <ListItem
            primaryText="Add new event"
            leftIcon={<ContentAdd />}
            onClick={this.addEvent}
          />
          <Subheader>
            {'Statements'}
          </Subheader>
          {this.state.config.statements.map((statement, index) =>
            <ListItem key={index} disabled={true}>
              <TextField
                floatingLabelText="Statement name"
                value={statement.name}
                onChange={this.handleChangeList.bind(
                  this,
                  'statements',
                  'name',
                  index
                )}
              />
              <TextField
                floatingLabelText="Statement query"
                value={statement.query}
                onChange={this.handleChangeList.bind(
                  this,
                  'statements',
                  'query',
                  index
                )}
              />
            </ListItem>
          )}
          <ListItem
            primaryText="Add new statement"
            leftIcon={<ContentAdd />}
            onClick={this.addStatement}
          />
        </List>
      </Paper>
    );
  }
}

export default Benchmark;
