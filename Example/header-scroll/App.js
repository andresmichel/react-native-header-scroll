import React from 'react';
import { StyleSheet, View } from 'react-native';
import HeaderScrollView from './HeaderScrollView';
import HeaderFlatList from './HeaderFlatList';
import NavigationBarButton from './NavigationBarButton';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <HeaderFlatList
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
            <View style={{ flexDirection: 'row', width: 400, height: 20, backgroundColor: 'green', alignItems: 'center' }}>
            </View>
          }
          data={[]}
        >
          {/* <View style={styles.item} />
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
          <View style={styles.item} /> */}
        </HeaderFlatList>
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
