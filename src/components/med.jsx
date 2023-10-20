// import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';

// const Med = props => {
//   const Med = props.Med;
//   const date = new Date(Med.createdDate);
//   const dateFormatted = `${
//     date.getMonth() + 1
//   }/${date.getDate()}/${date.getFullYear()}`;

//   return (
//     <Link
//       onClick={props.onClick}
//       to={`/Med/${Med._id}`}
//       className='list-group-item list-group-item-action'>
//       <strong>{Med.title}</strong>{' '}
//       <span className='text-muted small'>
//         {/* {!props.noAuthor && <>by {Med.author.username}</>} on {dateFormatted}{' '} */}
//       </span>
//     </Link>
//   );
// };

// export default Med;
