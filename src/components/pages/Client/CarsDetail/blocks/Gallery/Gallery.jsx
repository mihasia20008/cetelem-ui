import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Carousel, { Modal, ModalGateway } from 'react-images';

import styles from './Gallery.module.scss';

const NEXT_TRIGGER = 2;

class Gallery extends PureComponent {
  static propsTypes = {
    images: PropTypes.arrayOf(
      PropTypes.shape({
        index: PropTypes.number,
        src: PropTypes.string,
      })
    ),
  };

  static defaultProps = {
    images: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      wrapperWidth: '100%',
      currentImage: 0,
      fullScreenImage: 0,
    };

    this.galleryRef = React.createRef();
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    const gallery = this.galleryRef.current;
    if (window === undefined || !gallery) {
      return;
    }

    const { wrapperWidth: currentWrapperWidth } = this.state;

    const galleryRect = gallery.getBoundingClientRect();
    const wrapperWidth = window.screen.width - galleryRect.left;

    if (wrapperWidth !== currentWrapperWidth) {
      this.setState({ wrapperWidth });
    }
  };

  handleOpenFullScreen = index =>
    this.setState({
      fullScreenOpen: true,
      fullScreenImage: index,
    });

  handleCloseFullScreen = () => this.setState({ fullScreenOpen: false });

  handleImageClick = index => () => {
    const { currentImage } = this.state;
    const { images } = this.props;

    if (currentImage + NEXT_TRIGGER === index) {
      this.setState({ currentImage: currentImage + 1 });
      return;
    }

    if (!index && currentImage + NEXT_TRIGGER === images.length) {
      this.setState({ currentImage: index });
      return;
    }

    this.handleOpenFullScreen(index);
  };

  render() {
    const { images } = this.props;
    const { wrapperWidth, currentImage, fullScreenOpen, fullScreenImage } = this.state;

    return (
      <div className={styles.Gallery} ref={this.galleryRef}>
        <div
          className={styles.wrapper}
          style={{
            width: wrapperWidth,
          }}
        >
          <div
            className={styles.track}
            style={{
              width: (images.length + 1) * 520 - 20,
              transform: `translate3d(${-520 * currentImage}px, 0px, 0px)`,
            }}
          >
            {images.map((image, index) => {
              return (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                <div key={image.id} className={styles.item} onClick={this.handleImageClick(index)}>
                  <img className={styles.image} src={image.src} alt="" />
                </div>
              );
            })}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <div key={images.length} className={styles.item} onClick={this.handleImageClick(0)}>
              <img className={styles.image} src={images[0].src} alt="" />
            </div>
          </div>
        </div>
        <ModalGateway>
          {fullScreenOpen ? (
            <Modal
              closeOnBackdropClick={false}
              onClose={this.handleCloseFullScreen}
              styles={{
                blanket: StyleObj => ({ ...StyleObj, zIndex: 2 }),
                positioner: StyleObj => ({ ...StyleObj, zIndex: 2 }),
              }}
            >
              <Carousel
                currentIndex={fullScreenImage}
                views={images}
                frameProps={{ autoSize: 'height' }}
              />
            </Modal>
          ) : null}
        </ModalGateway>
      </div>
    );
  }
}

export default Gallery;
