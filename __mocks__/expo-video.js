const React = require('react');
const { View } = require('react-native');

module.exports = {
  useVideoPlayer: () => ({}),
  VideoView: (props) => React.createElement(View, { testID: 'mock-video-view', ...props }),
};
