import React, {useEffect,useState} from "react"
import { useDispatch, useSelector } from "react-redux";
import { formatDateTime } from "../../services/helpers";
import {getPostDataAction} from "../../redux/actions/posts/postDataActions";
import { ScreenLoader } from "../commons/ScreenLoader";

export const Posts = () => {

 const dispatch = useDispatch();

 const loading = useSelector(state => state.post_data.loading);
 const postData = useSelector(state => state.post_data.data);

  useEffect(() => {
     dispatch(getPostDataAction({}))
  }, []);
  

  return (
        <>
         <ScreenLoader status={loading}/>
          <div className="posts-wrapper">
            <div className="container p-4">
               <div className="d-flex justify-content-between mb-2">
                 <h5>Blog Post</h5>
                 <a href="/create/post" className="btn btn-sm btn-primary">+Add New Post</a>
               </div>
            <div className="table-responsive">
            <table className="table">
                <thead>
                  <tr className="text-center">
                    <th scope="col">Title</th>
                    <th scope="col">Author</th>
                    <th scope="col">Date Posted</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    postData ?  
                    postData?.data?.map((data) => (
                    <tr key={data?.title} className="text-center">
                      <td >{data?.title}</td>
                      <td>{data?.creator?.name}</td>
                      <td>{formatDateTime(data?.created_on)}</td>
                      <td>
                        <a href = {`post/edit/${data?.id}`}  className="btn btn-sm btn-primary me-4">
                          Edit
                        </a>
                        <button className="btn btn-sm btn-danger">
                          Delete
                        </button>
                      </td>
                    </tr>
                    
                    ))
                      
                    :
                    <tr>
                      <td>No Data</td>
                    </tr>
                  }
                  
                </tbody>
              </table>
            </div>
            </div>

          </div>
        </>

   )
}