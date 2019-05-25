import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Animated, TextInput, Text, Keyboard, TouchableOpacity } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { getStatusBarHeight } from 'react-native-status-bar-height'

const BORDER_WIDTH = StyleSheet.hairlineWidth
const STATUS_BAR_HEIGHT = getStatusBarHeight()

const FIXED_HEADER_HEIGHT = 50
const FIXED_HEADER_TOTAL_HEIGHT = STATUS_BAR_HEIGHT + FIXED_HEADER_HEIGHT

const BOTTOM_HEADER_HEIGHT = 60

const MIN_FONT_SIZE = 40
const MAX_FONT_SIZE = 42

const SEARCH_BOX_HEIGHT = 35
const SEARCH_BOX_MARGIN_TOP = 10
const SEARCH_BOX_TOTAL_HEIGHT = SEARCH_BOX_HEIGHT + SEARCH_BOX_MARGIN_TOP

const FIXED_HEADER_TITLE_BREAKPOINT = MIN_FONT_SIZE + SEARCH_BOX_TOTAL_HEIGHT - 4

const MIN_HEADER_HEIGHT = FIXED_HEADER_TOTAL_HEIGHT + BORDER_WIDTH
const INITIAL_HEADER_HEIGHT = FIXED_HEADER_TOTAL_HEIGHT + BOTTOM_HEADER_HEIGHT
const MAX_HEADER_HEIGHT = INITIAL_HEADER_HEIGHT + SEARCH_BOX_TOTAL_HEIGHT

const HEADER_TOTAL_HEIGHT = FIXED_HEADER_TOTAL_HEIGHT + BOTTOM_HEADER_HEIGHT + SEARCH_BOX_TOTAL_HEIGHT

const SEARCH_BOX_VISIBLE_SCROLL_POSITION = 0
const SEARCH_BOX_HIDDEN_SCROLL_POSITION = SEARCH_BOX_TOTAL_HEIGHT
const HEADER_COLLAPSED_SCROLL_POSITION = BOTTOM_HEADER_HEIGHT + SEARCH_BOX_TOTAL_HEIGHT

export default (WrappedComponent) => {
  class HeaderScrollHOC extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        value: this._getInitialPosition(),
        direction: 'DOWN',
        searchBarFocus: false,
      }
      this._scrollDistance = new Animated.Value(this._getInitialPosition())
      this._scrollView = React.createRef
      this._scrollDistance.addListener(({ value }) => {
        this.setState(prevState => ({
          value,
          direction: prevState.value >= value ? 'DOWN' : 'UP'
        }))
      })
    }

    componentDidMount() {
      this._scrollTo({ y: this._getInitialPosition(), animated: false })
    }

    // componentDidUpdate(props) {
    //   if (this.state.value === 0 && this.props.showSearchBox === true) {
    //     this._scrollTo({ y: this._getInitialPosition(), animated: false })
    //   } else if (this.state.value === SEARCH_BOX_HIDDEN_SCROLL_POSITION && this.props.showSearchBox === false) {
    //     this._scrollTo({ y: this._getInitialPosition(), animated: false })
    //   }
    // }

    _getInitialPosition() {
      return this.props.showSearchBox ? SEARCH_BOX_HIDDEN_SCROLL_POSITION : 0;
    }

    _getPaddingTop() {
      return HEADER_TOTAL_HEIGHT - (this.props.showSearchBox ? 0 : SEARCH_BOX_TOTAL_HEIGHT)
    }

    _scrollTo(options) {
      const scrollTo = this._scrollView.scrollTo || this._scrollView.scrollToOffset
      if (scrollTo) {
        scrollTo(options)
      }
    }

    render() {
      let animatedTitleHeight = this._scrollDistance.interpolate({
        inputRange: [SEARCH_BOX_VISIBLE_SCROLL_POSITION, SEARCH_BOX_HIDDEN_SCROLL_POSITION, HEADER_COLLAPSED_SCROLL_POSITION],
        outputRange: [MAX_HEADER_HEIGHT, INITIAL_HEADER_HEIGHT, MIN_HEADER_HEIGHT],
        extrapolateLeft: 'extend',
        extrapolateRight: 'clamp',
      })

      let animatedTopTitleOpacity = this._scrollDistance.interpolate({
        inputRange: [FIXED_HEADER_TITLE_BREAKPOINT - 1, FIXED_HEADER_TITLE_BREAKPOINT],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      })

      let animatedFontSize = this._scrollDistance.interpolate({
        inputRange: [-60, 0],
        outputRange: [MAX_FONT_SIZE, MIN_FONT_SIZE],
        extrapolate: 'clamp',
      })

      let animatedSearchBoxMarginTop = this._scrollDistance.interpolate({
        inputRange: [SEARCH_BOX_HEIGHT, SEARCH_BOX_HIDDEN_SCROLL_POSITION],
        outputRange: [SEARCH_BOX_MARGIN_TOP, 0],
        extrapolate: 'clamp',
      })

      let animatedSearchBoxHeight = this._scrollDistance.interpolate({
        inputRange: [0, SEARCH_BOX_HEIGHT],
        outputRange: [SEARCH_BOX_HEIGHT, 0],
        extrapolate: 'clamp',
      })

      let animatedSearchBoxPlaceholderOpacity = this._scrollDistance.interpolate({
        inputRange: [0, 10],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      })

      if (!this.props.showSearchBox) {
        animatedTitleHeight = this._scrollDistance.interpolate({
          inputRange: [SEARCH_BOX_VISIBLE_SCROLL_POSITION, HEADER_COLLAPSED_SCROLL_POSITION],
          outputRange: [MAX_HEADER_HEIGHT - SEARCH_BOX_TOTAL_HEIGHT, MIN_HEADER_HEIGHT - SEARCH_BOX_TOTAL_HEIGHT],
          extrapolateLeft: 'extend',
          extrapolateRight: 'clamp',
        })

        animatedSearchBoxMarginTop = this._scrollDistance.interpolate({
          inputRange: [SEARCH_BOX_HEIGHT, SEARCH_BOX_HIDDEN_SCROLL_POSITION],
          outputRange: [0, 0],
          extrapolate: 'clamp',
        })

        animatedSearchBoxHeight = this._scrollDistance.interpolate({
          inputRange: [0, SEARCH_BOX_HEIGHT],
          outputRange: [0, 0],
          extrapolate: 'clamp',
        })
      }

      const props = {
        ref: ref => this._scrollView = ref,
        scrollEventThrottle: 16,
        contentContainerStyle: { paddingTop: this._getPaddingTop() },
        onMomentumScrollBegin: (event) => {
          // console.log(event.nativeEvent)
        },
        onScroll: event => {
          Animated.event(
            [{ nativeEvent: { contentOffset: { y: this._scrollDistance } } }]
          )(event)
          this.props.onScroll ? this.props.onScroll(event) : null
        },
        onScrollEndDrag: event => {
          if (this.state.value > 0 && this.state.value < HEADER_COLLAPSED_SCROLL_POSITION) {
            if (this.state.direction === 'UP') {
              if (this.state.value > SEARCH_BOX_HIDDEN_SCROLL_POSITION) {
                // this._scrollTo({ y: HEADER_COLLAPSED_SCROLL_POSITION, animated: true })
              } else if (this.props.showSearchBox) {
                this._scrollTo({ y: SEARCH_BOX_HIDDEN_SCROLL_POSITION, animated: true })
              }
            } else {
              if (this.state.value < SEARCH_BOX_HIDDEN_SCROLL_POSITION) {
                this._scrollTo({ y: SEARCH_BOX_VISIBLE_SCROLL_POSITION, animated: true })
              } else {
                this._scrollTo({ y: SEARCH_BOX_HIDDEN_SCROLL_POSITION, animated: true })
              }
            }
          }
          this.props.onScrollEndDrag ? this.props.onScrollEndDrag(event) : null
        },
        keyboardDismissMode: 'on-drag',
        keyboardShouldPersistTaps: 'always',
      }

      return (
        <View style={styles.container}>
          <WrappedComponent {...this.props} {...props} />
          <Animated.View style={[styles.headerContainer, { height: animatedTitleHeight, }]}>
            <Animated.Text numberOfLines={1} ellipsizeMode={'clip'} style={[styles.headerTitle, { fontSize: animatedFontSize }]}>{this.props.title}</Animated.Text>
            <Animated.View style={[{ flexDirection: 'row', alignItems: 'center' }, { height: animatedSearchBoxHeight, marginTop: animatedSearchBoxMarginTop }]}>
              <View style={[styles.searchBoxContainer, { height: '100%' }]}>
                <Animated.View style={[styles.searchBoxInputContaier, { opacity: animatedSearchBoxPlaceholderOpacity }]}>
                  <MaterialIcons name={'search'} size={26} color={'rgba(0,0,0,0.2)'} />
                  <TextInput
                    onFocus={() => this.setState({ searchBarFocus: true })}
                    onBlur={() => this.setState({ searchBarFocus: false })}
                    placeholder={'Search...'}
                    placeholderTextColor={'rgba(0,0,0,0.2)'}
                    style={styles.searchBoxInput}
                  />
                </Animated.View>
              </View>
              <TouchableOpacity onPress={() => Keyboard.dismiss()} style={{ marginLeft: 10 }}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
          <View style={styles.fixedHeaderComponent}>
            <View style={styles.fixedHeader}>
              <Text style={{ flex: 1, color: '#0068ff', fontSize: 16 }}>Editar</Text>
              <Animated.Text numberOfLines={1} ellipsizeMode={'clip'} style={[styles.fixedHeaderTitle, { opacity: animatedTopTitleOpacity }]}>{this.props.title}</Animated.Text>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }} >
                <MaterialIcons name={'add'} size={26} color={'#0068ff'} />
              </View>
            </View>
          </View>
        </View>
      )
    }
  }

  HeaderScrollHOC.propTypes = {
    title: PropTypes.string.isRequired,
    showSearchBox: PropTypes.bool,
  }

  HeaderScrollHOC.defaultProps = {
    showSearchBox: false,
  }

  return HeaderScrollHOC
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedHeaderComponent: {
    position: 'absolute',
    top: 0,
    height: FIXED_HEADER_TOTAL_HEIGHT,
    paddingTop: STATUS_BAR_HEIGHT,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  fixedHeader: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  fixedHeaderTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    justifyContent: 'flex-end',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: BORDER_WIDTH,
    borderColor: 'rgba(0,0,0,0.3)',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontWeight: '700',
  },
  searchBoxContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
  },
  searchBoxInputContaier: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  searchBoxInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    paddingLeft: 10,
  },
})
