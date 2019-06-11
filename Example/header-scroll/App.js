import React from 'react';
import { StyleSheet, View } from 'react-native';
import HeaderScrollView from './HeaderScrollView';
import NavigationBarButton from './NavigationBarButton';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <HeaderScrollView
          title={'Navigation'}
          searchBarEnabled={true}
          searchBarPlaceholder={'Buscar..'}
          searchBarCancelText={'Cancelar'}
          onChange={text => console.log(text)}
          LeftControls={
            <View style={{ flexDirection: 'row' }}>
              <NavigationBarButton onPress={() => alert('onPress')}>Editar</NavigationBarButton>
            </View>
          }
          RightControls={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <NavigationBarButton icon={'add'} onPress={() => alert('onPress')} />
            </View>
          }
          SegmentedControl={
            <View style={{ flexDirection: 'row', width: 400, height: 200, backgroundColor: 'green', alignItems: 'center' }}>
            </View>
          }
        >
          <View style={styles.item} />
          <View style={styles.item} />
          <View style={styles.item} />
          <View style={styles.item} />
          <View style={styles.item} />
          <View style={styles.item} />
          <View style={styles.item} />
          <View style={styles.item} />
          <View style={styles.item} />
          <View style={styles.item} />
          <View style={styles.item} />
          <View style={styles.item} />
          <View style={styles.item} />
          <View style={styles.item} />
          <View style={styles.item} />
          <View style={styles.item} />
          <View style={styles.item} />
          <View style={styles.item} />
          <View style={styles.item} />
          <View style={styles.item} />
          <View style={styles.item} />
          <View style={styles.item} />
          <View style={styles.item} />
        </HeaderScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    height: 50,
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#d3d3d3',
  }
});
