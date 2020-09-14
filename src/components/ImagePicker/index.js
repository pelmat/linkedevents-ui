import './index.scss';
import React, {Fragment, Component} from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage, injectIntl} from 'react-intl';
import {Button, Modal, ModalHeader, ModalBody} from 'reactstrap';
import {connect} from 'react-redux';
import ImageGalleryGrid from '../ImageGalleryGrid';


// Display either the image thumbnail or the "Add an image to the event" text.
export const PreviewImage = (props) => {
    const backgroundImage = props.backgroundImage ? props.backgroundImage : null;
    const backgroundStyle = {backgroundImage: 'url(' + backgroundImage + ')'};

    if (backgroundImage) {
        return (
            <Fragment>
                <div
                    className='image-picker--preview'
                    style={backgroundStyle}
                />
            </Fragment>
        );
    } else {
        return (
            <Fragment>
                <div
                    className='image-picker--preview'>
                    <FormattedMessage id='no-image' />
                </div>
            </Fragment>
        );
    }
};

export class ImagePicker extends Component {
    constructor(props) {
        super(props);
    }

    getModalCloseButton() {
        return (
            <Button onClick={this.props.close} aria-label={this.context.intl.formatMessage({id: `close`})}><span className="glyphicon glyphicon-remove"></span></Button>
        );
    }

    render() {
        const closebtn = this.getModalCloseButton();

        return (
            <React.Fragment>
                <Modal
                    className='image-picker--dialog'
                    isOpen={this.props.isOpen}
                    toggle={this.props.close}
                    size='xl'
                    role='dialog'
                    id='dialog1'
                    aria-modal='true'>

                    <ModalHeader tag='h1' close={closebtn}>
                        <FormattedMessage id='event-image-title' />
                    </ModalHeader>
                    <ModalBody>
                        <ModalHeader tag='h2' className='image-picker--dialog-title'>
                            <FormattedMessage id='use-existing-image' />
                        </ModalHeader>
                        <ImageGalleryGrid
                            close={this.props.close}
                            editor={this.props.editor}
                            user={this.props.user}
                            images={this.props.images}
                            locale={this.props.intl.locale}
                        />    
                    </ModalBody>
                </Modal>
            </React.Fragment>
        );
    }
}

ImagePicker.defaultProps = {
    editor: {
        values: {},
    },
    images: {},
    user: {},
    loading: true,
};

ImagePicker.propTypes = {
    editor: PropTypes.object,
    user: PropTypes.object,
    images: PropTypes.object,
    children: PropTypes.element,
    intl: PropTypes.object,
    locale: PropTypes.string,
    isOpen: PropTypes.bool,
    close: PropTypes.func,
};

ImagePicker.contextTypes = {
    intl: PropTypes.object,
}

PreviewImage.propTypes = {
    backgroundImage: PropTypes.string,
};

const mapStateToProps = (state) => ({
    user: state.user,
    editor: state.editor,
    images: state.images,
});

export default injectIntl(connect(mapStateToProps)(ImagePicker));
