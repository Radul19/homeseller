const Comment = (props) =>{
    return(
        <>
        <div className="comment-display" >
            <p className="_date" >User / date / time</p>
            <p className="_comment">Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi quaerat aliquid quisquam consequatur rem aperiam.</p>
        </div>
        {props.reply ?
        <div className="reply-display" >
            <p className="_date" >User / date / time</p>
            <p className="_comment">Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt magnam porro dolores distinctio deserunt iure tempora eius officiis omnis perferendis.</p>
        </div> : null }
        </>
    )
}
export default Comment