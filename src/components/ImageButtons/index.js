import React from 'react'
import {Button} from 'reactstrap'
import ImageEdit from '../ImageEdit'
import ImagePickerForm from '../ImagePicker'
import {FormattedMessage, injectIntl} from 'react-intl';

class ImageButtons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openEditModa: false,
            openorgModal: false,
        }
        this.toggleEditModal = this.toggleEditModal.bind(this)
        this.toggleOrgModal = this.toggleOrgModal.bind(this)
    }

    toggleEditModal() {
        this.setState({openEditModal: !this.state.openEditModal})
    }

    toggleOrgModal() {
        this.setState({openOrgModal: !this.state.openOrgModal})
    }

    render () {
        return (
            <React.Fragment>
                <div className='image-buttons'>
                    <FormattedMessage id="choose-image"/>
                    <Button
                        size='lg' block
                        onClick={this.toggleEditModal}
                    >
                        <FormattedMessage id='upload-new-image' />
                    </Button>
                    <Button
                        size='lg' block
                        onClick={this.toggleOrgModal}
                    >
                        <FormattedMessage id='upload-image-select-bank' />
                    </Button>
                    <ImageEdit open={this.state.openEditModal} close={this.toggleEditModal}/>
                    <ImagePickerForm label="image-preview" name="image" loading={false} isOpen={this.state.openOrgModal} close={this.toggleOrgModal}/>
                </div>
            </React.Fragment>
        )
    }
}

export default ImageButtons
