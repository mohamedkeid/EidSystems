import React, { Component } from "react";
import { Link } from "react-router-dom";

/**
* Component making up a single blog post
* @extends Component
*/
class Post extends Component {
    render() {
        const date = new Date(this.props.date);
        const dateString = date.toLocaleDateString('en-US', {
            day : 'numeric',
            month : 'short',
            year : 'numeric'
        });
        const dateText = `By Mohamed Eid on ${dateString}`;
        const postUrl = `/blog/${this.props.title}`;

        return (
            <div className="post">
                <div className="title">{this.props.title}</div>
                <div className="date">{dateText}</div>
                <img src={this.props.imgSrc} />
                <div className="preview">{this.props.preview}</div>
                {this.props.content ? (
                    <Link to={postUrl} className="read-more">
                        Read more
                    </Link>
                ) : null}
            </div>
        );
    }
}

export default Post;
