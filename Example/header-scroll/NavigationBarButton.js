import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

class NavigationBarButton extends React.Component {
  render() {
    const { children, ...props } = this.props
    return (
      <TouchableOpacity {...props}>
        {Boolean(children) && <Text style={{ color: '#0068ff', fontSize: 16 }}>{children}</Text>}
        {Boolean(props.icon) && <MaterialIcons name={props.icon} size={26} color={'#0068ff'} />}
      </TouchableOpacity>
    )
  }
}

export default NavigationBarButton