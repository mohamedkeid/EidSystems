import React, { Component } from "react";
import ReactModal from "react-modal";
import { Field } from "redux-form";
import { push } from "react-router-redux";
import { Notification } from 'react-notification';

import {
    CancelButton,
    DangerButton,
    SubmitButton,
    SuccessButton
} from "../../ui/buttons";
import { getFileObject, renderFileInput } from "../../ui/render_file_input";
import { convertToFormData } from "../../../helpers";
import renderTextField from "../../ui/render_text_field";

/*
* Form component for creating new posts and updating existing ones
* @extends Component
*/
class PostForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsVisible: false
        };

        // Bind this
        this.checkPost = this.checkPost.bind(this);
        this.createPost = this.createPost.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderTextField = renderTextField.bind(this);
        this.toggleNotification = this.toggleNotification.bind(this);
        this.updatePost = this.updatePost.bind(this);
    }

    /** If page object was found in store, init the redux form else fetch it */
    checkPost() {
        const match = this.props.match;
        const isEditForm = match && match.params.post_id;

        if (!this.state.post && isEditForm) {
            const postId = match.params.post_id;
            const post = this.props.posts[postId];

            if (post) {
                getFileObject(post.imgSrc, imageFile => {
                    post.imageFile = [imageFile];
                    this.setState({post});
                    this.props.initialize(post);
                });
            } else {
                this.props.showPost(postId);
            }
        }
    }

    /** Dispatch redux action to update page status and possibly init form */
    componentDidMount() {
        this.props.updateAdminPage("Posts");
        this.props.initialize({
            title: "",
            preview: "",
            description: ""
        });
        this.checkPost();
    }

    /** Check if page object is in the redux store on update */
    componentDidUpdate() {
        this.checkPost();
    }

    createPost(formData) {
        this.props.createPost(formData)
            .then(() => {
                this.props.dispatch(push("/admin/posts"));
            })
            .catch(response => {
                console.log(response);
            });
    }

    deletePost() {
        this.props.deletePost(this.state.post._id)
            .then(() => {
                this.props.dispatch(push("/admin/posts"));
            })
            .catch(response => {
                console.log(response);
            });
        this.handleCloseModal();
    }

    /** Update state to reflect that the delete modal is closed */
    handleCloseModal() {
        this.setState({
            modalIsVisible: false
        });
    }

    /** Update state to reflect that the delete modal is opened */
    handleOpenModal() {
        this.setState({
            modalIsVisible: true
        });
    }

    /** Handle a validated redux form submission of the form */
    handleSubmit(data) {
        // Make copy of data so the form doesn't update on the proceeding edits
        const postData = Object.assign({}, data);
        const formData = convertToFormData(postData, "post");

        // If the form is modifying an existing post, update it. Else create it
        const formPost = this.state.post;
        if (formPost) {
            this.updatePost(formPost._id, formData);
        } else {
            this.createPost(formData);
        }
    }

    toggleNotification() {
        this.setState({
          notificationIsActive: !this.state.notificationIsActive
        });
    }

    updatePost(postId, formData) {
        this.props.updatePost(postId, formData)
            .then(() => {
                this.toggleNotification();
            })
            .catch(response => {
                console.log(response);
            });
    }

    render() {
        let head = this.state.post ? "Edit Post" : "New Post";
        const deleteButton = this.state.post ? (
            <DangerButton
                 value="Delete"
                 onClick={this.handleOpenModal} />
        ) : null
        const savedButton = <SuccessButton value="Saved!" />
        const saveButton = <SubmitButton value="Save" />

        return (
            <form
                encType="multipart/form-data"
                onSubmit={this.props.handleSubmit(this.handleSubmit)}>
                <div className="head">
                    {head}
                </div>
                <div className="inputs">
                    <Field
                        name="title"
                        title="Title"
                        element="input"
                        type="text"
                        component={this.renderTextField} />
                    <Field
                        name="preview"
                        title="Preview"
                        element="textArea"
                        type="text"
                        component={this.renderTextField} />
                    <Field
                        name="imageFile"
                        title="Image File"
                        component={renderFileInput} />
                    {deleteButton}
                    {this.state.hasSaved ? savedButton : saveButton}
                    <CancelButton
                        redirect={
                            () => this.props.history.push("/admin/posts")
                        } />
                </div>
                <ReactModal
                    className="modal"
                    isOpen={this.state.modalIsVisible}
                    contentLabel="Delete Post" >
                <div className="head">
                    Delete Post
                </div>
                <p>
                   Are you sure you want to delete this document?
                   This cannot be undone.
                </p>
                <DangerButton
                     value="Delete"
                     onClick={this.deletePost} />
                <CancelButton
                     onClick={this.handleCloseModal} />
                </ReactModal>
                <Notification
                    dismissAfter={5000}
                    isActive={this.state.notificationIsActive}
                    message="This project was successfully saved.."
                    action="Dismiss"
                    title="Success!"
                    onDismiss={this.toggleNotification.bind(this)}
                    onClick={() =>  this.setState({
                        notificationIsActive: false
                    })}
                />
            </form>
        )
    }
}


export default PostForm
