import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Animated, TextInput, Text, Keyboard, TouchableOpacity } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import NavigationBarButton from './NavigationBarButton'

const BORDER_WIDTH = StyleSheet.hairlineWidth
const STATUS_BAR_HEIGHT = getStatusBarHeight()

const FIXED_HEADER_HEIGHT = 50
const FIXED_HEADER_TOTAL_HEIGHT = STATUS_BAR_HEIGHT + FIXED_HEADER_HEIGHT

const BOTTOM_HEADER_HEIGHT = 60

const MIN_FONT_SIZE = 40
const MAX_FONT_SIZE = 42

const SEARCH_BAR_HEIGHT = 35
const SEARCH_BAR_MARGIN_TOP = 10
const SEARCH_BAR_TOTAL_HEIGHT = SEARCH_BAR_HEIGHT + SEARCH_BAR_MARGIN_TOP

const FIXED_HEADER_TITLE_BREAKPOINT = MIN_FONT_SIZE + SEARCH_BAR_TOTAL_HEIGHT - 4

const MIN_HEADER_HEIGHT = FIXED_HEADER_TOTAL_HEIGHT + BORDER_WIDTH
const INITIAL_HEADER_HEIGHT = FIXED_HEADER_TOTAL_HEIGHT + BOTTOM_HEADER_HEIGHT
const MAX_HEADER_HEIGHT = INITIAL_HEADER_HEIGHT + SEARCH_BAR_TOTAL_HEIGHT

const HEADER_TOTAL_HEIGHT = FIXED_HEADER_TOTAL_HEIGHT + BOTTOM_HEADER_HEIGHT + SEARCH_BAR_TOTAL_HEIGHT

const SEARCH_BAR_VISIBLE_SCROLL_POSITION = 0
const SEARCH_BAR_HIDDEN_SCROLL_POSITION = SEARCH_BAR_TOTAL_HEIGHT
const HEADER_COLLAPSED_SCROLL_POSITION = BOTTOM_HEADER_HEIGHT + SEARCH_BAR_TOTAL_HEIGHT

export default (WrappedComponent) => {
  class HeaderScrollHOC extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        value: this._getInitialPosition(),
        direction: 'DOWN',
        searchBarFocused: false,
        searchBarFocusable: true,
        searchBarReadyToClose: false,
        searchQuery: undefined,
      }
      this._scrollDistance = new Animated.Value(this._getInitialPosition())
      this._scrollView = React.createRef
      this._scrollDistance.addListener(({ value }) => {
        this.setState(prevState => ({
          value,
          direction: prevState.value >= value ? 'DOWN' : 'UP'
        }))
      })
      this._searchBarButtonTranslation = new Animated.Value(0)
      this._searchBarButtonOpacity = new Animated.Value(0)
      this._searchBarButtonWidth = new Animated.Value(0)
    }

    componentDidMount() {
      this._scrollTo({ y: this._getInitialPosition(), animated: false })
    }

    // componentDidUpdate(props) {
    //   if (this.state.value === 0 && this.props.searchBarEnabled === true) {
    //     this._scrollTo({ y: this._getInitialPosition(), animated: false })
    //   } else if (this.state.value === SEARCH_BAR_HIDDEN_SCROLL_POSITION && this.props.searchBarEnabled === false) {
    //     this._scrollTo({ y: this._getInitialPosition(), animated: false })
    //   }
    // }

    _getInitialPosition() {
      return this.props.searchBarEnabled ? SEARCH_BAR_HIDDEN_SCROLL_POSITION : 0;
    }

    _getPaddingTop() {
      return HEADER_TOTAL_HEIGHT - (this.props.searchBarEnabled ? 0 : SEARCH_BAR_TOTAL_HEIGHT)
    }

    _scrollTo(options) {
      const scrollTo = this._scrollView.scrollTo || this._scrollView.scrollToOffset
      if (scrollTo) {
        scrollTo(options)
      }
    }

    _onFocus() {
      this.setState({ searchBarFocused: true })
      this._scrollTo({ y: 120 })
      Animated.parallel([
        Animated.timing(
          this._searchBarButtonTranslation,
          {
            toValue: 0,
            duration: 150,
          }
        ),
        Animated.timing(
          this._searchBarButtonOpacity,
          {
            toValue: 1,
            duration: 150,
          }
        ),
        Animated.timing(
          this._searchBarButtonWidth,
          {
            toValue: 75,
            duration: 150,
          }
        ),
      ]).start()
    }

    _cancel() {
      Keyboard.dismiss()
      this.setState({ searchQuery: undefined })
      if (this.props.onChange) {
        this.props.onChange(undefined)
      }
      this._scrollTo({ y: 0 })
      Animated.parallel([
        Animated.timing(
          this._searchBarButtonTranslation,
          {
            toValue: 75,
            duration: 150,
          }
        ),
        Animated.timing(
          this._searchBarButtonOpacity,
          {
            toValue: 0,
            duration: 150,
          }
        ),
        Animated.timing(
          this._searchBarButtonWidth,
          {
            toValue: 0,
            duration: 150,
          }
        ),
      ]).start()
    }

    render() {
      let animatedTitleHeight = this._scrollDistance.interpolate({
        inputRange: [SEARCH_BAR_VISIBLE_SCROLL_POSITION, SEARCH_BAR_HIDDEN_SCROLL_POSITION, HEADER_COLLAPSED_SCROLL_POSITION],
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

      let animatedSearchBarMarginTop = this._scrollDistance.interpolate({
        inputRange: [SEARCH_BAR_HEIGHT, SEARCH_BAR_HIDDEN_SCROLL_POSITION],
        outputRange: [SEARCH_BAR_MARGIN_TOP, 0],
        extrapolate: 'clamp',
      })

      let animatedSearchBarHeight = this._scrollDistance.interpolate({
        inputRange: [0, SEARCH_BAR_HEIGHT],
        outputRange: [SEARCH_BAR_HEIGHT, 0],
        extrapolate: 'clamp',
      })

      let animatedSearchBarPlaceholderOpacity = this._scrollDistance.interpolate({
        inputRange: [0, 10],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      })

      let headerTitleTranslation = this._scrollDistance.interpolate({
        inputRange: [0, 80],
        outputRange: [0, 0],
        extrapolate: 'clamp',
      })

      let fixedHeaderTranslation = this._scrollDistance.interpolate({
        inputRange: [0, 80],
        outputRange: [0, 0],
        extrapolate: 'clamp',
      })

      if (!this.props.searchBarEnabled) {
        animatedTitleHeight = this._scrollDistance.interpolate({
          inputRange: [SEARCH_BAR_VISIBLE_SCROLL_POSITION, HEADER_COLLAPSED_SCROLL_POSITION],
          outputRange: [MAX_HEADER_HEIGHT - SEARCH_BAR_TOTAL_HEIGHT, MIN_HEADER_HEIGHT],
          extrapolateLeft: 'extend',
          extrapolateRight: 'clamp',
        })

        animatedSearchBarMarginTop = this._scrollDistance.interpolate({
          inputRange: [SEARCH_BAR_HEIGHT, SEARCH_BAR_HIDDEN_SCROLL_POSITION],
          outputRange: [0, 0],
          extrapolate: 'clamp',
        })

        animatedSearchBarHeight = this._scrollDistance.interpolate({
          inputRange: [0, SEARCH_BAR_HEIGHT],
          outputRange: [0, 0],
          extrapolate: 'clamp',
        })
      }

      if (this.state.searchBarFocused) {
        headerTitleTranslation = this._scrollDistance.interpolate({
          inputRange: [0, 80],
          outputRange: [0, -80],
          extrapolate: 'clamp',
        })

        fixedHeaderTranslation = this._scrollDistance.interpolate({
          inputRange: [0, 80],
          outputRange: [0, -180],
          extrapolate: 'clamp',
        })

        animatedSearchBarMarginTop = this._scrollDistance.interpolate({
          inputRange: [SEARCH_BAR_HEIGHT, SEARCH_BAR_HIDDEN_SCROLL_POSITION],
          outputRange: [SEARCH_BAR_MARGIN_TOP, SEARCH_BAR_MARGIN_TOP],
          extrapolate: 'clamp',
        })

        animatedSearchBarHeight = this._scrollDistance.interpolate({
          inputRange: [0, SEARCH_BAR_HEIGHT],
          outputRange: [SEARCH_BAR_HEIGHT, SEARCH_BAR_HEIGHT],
          extrapolate: 'clamp',
        })

        animatedSearchBarPlaceholderOpacity = this._scrollDistance.interpolate({
          inputRange: [0, 10],
          outputRange: [1, 1],
          extrapolate: 'clamp',
        })
      }

      const props = {
        ref: ref => this._scrollView = ref,
        scrollEventThrottle: 16,
        contentContainerStyle: { paddingTop: this._getPaddingTop() },
        onMomentumScrollBegin: (event) => {
          this.setState({ searchBarFocusable: false })
        },
        onMomentumScrollEnd: (event) => {
          if (this.state.searchBarFocusable) {
            if (this.state.searchBarFocused) {
              if (this.state.searchBarReadyToClose) {
                this.setState({ searchBarFocused: false })
                this.setState({ searchBarReadyToClose: false })
              } else {
                this.setState({ searchBarReadyToClose: true })
              }
            }
          } else {
            this.setState({ searchBarFocusable: true })
          }
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
              if (this.state.value > SEARCH_BAR_HIDDEN_SCROLL_POSITION) {
                // this._scrollTo({ y: HEADER_COLLAPSED_SCROLL_POSITION, animated: true })
              } else if (this.props.searchBarEnabled) {
                this._scrollTo({ y: SEARCH_BAR_HIDDEN_SCROLL_POSITION, animated: true })
              }
            } else {
              if (this.state.value < SEARCH_BAR_HIDDEN_SCROLL_POSITION || !this.props.searchBarEnabled) {
                this._scrollTo({ y: SEARCH_BAR_VISIBLE_SCROLL_POSITION, animated: true })
              } else {
                this._scrollTo({ y: SEARCH_BAR_HIDDEN_SCROLL_POSITION, animated: true })
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
          <Animated.View style={[styles.headerContainer, { height: animatedTitleHeight }]}>
            <Animated.Text
              numberOfLines={1}
              ellipsizeMode={'clip'}
              style={[
                styles.headerTitle,
                { fontSize: animatedFontSize },
                { transform: [{ translateY: headerTitleTranslation }] },
              ]}
            >
              {this.props.title}
            </Animated.Text>
            <Animated.View style={[{ flexDirection: 'row', alignItems: 'center' }, { height: animatedSearchBarHeight, marginTop: animatedSearchBarMarginTop }]}>
              <View style={[styles.searchBarContainer, { height: '100%' }]}>
                <Animated.View style={[styles.searchBarInputContaier, { opacity: animatedSearchBarPlaceholderOpacity }]}>
                  <MaterialIcons name={'search'} size={26} color={'rgba(0,0,0,0.2)'} />
                  <TextInput
                    onFocus={() => this._onFocus()}
                    value={this.state.searchQuery}
                    placeholder={this.props.searchBarPlaceholder}
                    placeholderTextColor={'rgba(0,0,0,0.2)'}
                    pointerEvents={this.state.searchBarFocusable ? 'auto' : 'none'}
                    style={styles.searchBarInput}
                    onChange={(event) => {
                      this.setState({ searchQuery: event.nativeEvent.text })
                      if (this.props.onChange) {
                        this.props.onChange(event.nativeEvent.text)
                      }
                    }}
                  />
                </Animated.View>
              </View>
              <Animated.View style={{ width: this._searchBarButtonWidth, opacity: this._searchBarButtonOpacity, transform: [{ translateX: this._searchBarButtonTranslation }] }}>
                <TouchableOpacity onPress={() => this._cancel()} style={{ marginLeft: 10, height: SEARCH_BAR_HEIGHT, alignItems: 'center', justifyContent: 'center' }}>
                  <Text numberOfLines={1} ellipsizeMode={'clip'}>{this.props.searchBarCancelText}</Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </Animated.View>
          <Animated.View style={[styles.fixedHeaderComponent, { transform: [{ translateY: fixedHeaderTranslation }] }]}>
            <View style={styles.fixedHeader}>
              <View style={{ flex: 1, height: FIXED_HEADER_HEIGHT, justifyContent: 'center', alignItems: 'flex-start', overflow: 'hidden' }}>
                {Boolean(this.props.LeftControls) && this.props.LeftControls}
              </View>
              {
                Boolean(this.props.SegmentedControl) &&
                <View style={{ flex: 1, height: FIXED_HEADER_HEIGHT, justifyContent: 'center', alignItems: 'flex-start', overflow: 'hidden' }}>
                  {this.props.SegmentedControl}
                </View>
              }
              {
                Boolean(!this.props.SegmentedControl) &&
                <Animated.Text numberOfLines={1} ellipsizeMode={'clip'} style={[styles.fixedHeaderTitle, { opacity: animatedTopTitleOpacity }]}>{this.props.title}</Animated.Text>
              }
              <View style={{ flex: 1, height: FIXED_HEADER_HEIGHT, justifyContent: 'center', alignItems: 'flex-end', overflow: 'hidden' }}>
                {Boolean(this.props.RightControls) && this.props.RightControls}
              </View>
            </View>
          </Animated.View>
        </View>
      )
    }
  }

  HeaderScrollHOC.propTypes = {
    title: PropTypes.string.isRequired,
    searchBarEnabled: PropTypes.bool,
    searchBarPlaceholder: PropTypes.string,
    searchBarCancelText: PropTypes.string,
    LeftControls: PropTypes.element,
    RightControls: PropTypes.element,
    SegmentedControl: PropTypes.element,
    onChange: PropTypes.func,
  }

  HeaderScrollHOC.defaultProps = {
    searchBarEnabled: false,
    searchBarPlaceholder: 'Search...',
    searchBarCancelText: 'Cancel',
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
  searchBarContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
  },
  searchBarInputContaier: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  searchBarInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    paddingLeft: 10,
  },
})
