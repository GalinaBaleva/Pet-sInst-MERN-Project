import PostForm from "../components/PostForm";

const NewPost = () => {
    return (
        <div className="createPage">
            <PostForm 
            button='Create New'
            legend='Add photo'
            path='/posts/create'
            />
        </div>
    )
}

export default NewPost;