import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { createCommentAction } from "../../redux/actions/posts/commentAction";
import { getCommentLstsAction } from "../../redux/actions/posts/commentListAction";
import { useParams } from 'react-router-dom';
import { ScreenLoader } from "../commons/ScreenLoader";
import { toast } from "react-toastify";
import { formatDateTime, getInitial, getSubString } from "../../services/helpers";
import auth from "../../services/auth/authService";

export const Comment = () => {
    const {id} = useParams()
    const dispatch = useDispatch();
    const error = useSelector(state => state.comments.error);
    const createStatusCode = useSelector(state => state.comments.statusCode);
    const comments = useSelector(state => state.comments_lists.data);
    const loading = useSelector(state => state.comments.loading)
    
 const [formData, setFormData] = useState({
    comment: '',
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  const postComment = async (e) => {
    e.preventDefault();
     await dispatch(createCommentAction({ data:{...formData}, id }));
     if(createStatusCode && createStatusCode ==201){
        setFormData({comment:''})
       toast.success("Comment created", {autoClose:200})
     }
  };


  const user = auth.getCurrentUser()

  useEffect(() => {
        dispatch(getCommentLstsAction(id))
  }, [dispatch]);


  return  (
        <>
        <ScreenLoader status={loading}/>
            <div className="row justify-content-center px-4">
              <div className="col-md-10 col-lg-10">
                <h5>Comments</h5>
                <hr />
                
                <form onSubmit={postComment}>
                    <div className="mb-3">
                        <textarea 
                        rows={4}
                        className="form-control" 
                        id="comment" 
                        placeholder="Good services"
                        value={formData.comment}
                        onChange={handleInputChange}
                        disabled = {!user? true: false}
                        name="comment"
                        />
                    </div>

                    <div className="mb-3 text-end">
                        {
                        error && <div className="alert alert-danger mb-2">{error?.message}</div>
                        }
                        {
                            user ? 
                            <>
                            <button className="btn btn-sm btn-primary">Comment</button>
                            </>
                            :
                            <a href="/login" className="btn btn-default btn-sm">
                                Please login to comment
                            </a>
                        }
                    </div>
                </form>
              </div>
            </div>
            {/* Comments */}
            {
                comments ?
               comments?.data?.map((comment,index) => (
                   <>
                    <div key={comment.id} className="row justify-content-center px-4">
                    <div className="col-md-10 col-lg-10">
                        <div className="mb-4">
                            <div className="d-flex">
                               
                                <small class="badge badge-sm me-5 rounded-pill bg-primary">
                                    {
                                        getInitial(comment.commenter.name)
                                    }
                                </small>

                                <div>
                                    <small>{comment.commenter.name}</small>
                                    <br />
                                    <small>{formatDateTime(comment.created_on)}</small>
                                </div>
                            </div>
                        </div>
                       <p>{getSubString( comment.comment, 200)}</p>
                        
                    </div>
                    </div>
                    <hr key={index * comment.id + 'now'} />
                   </>
                    
                  ))
                : 
                <div className="row mb-5">
                    <div className="col-12">
                        <p className="text-center">No comment</p>

                    </div>
                </div>
            }
        </>
    )
}