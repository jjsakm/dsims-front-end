export default function EgovPaging(props) {
  const { pagination, moveToPage } = props;

  let paginationTag = [];

  if (pagination === undefined) {
    paginationTag = "-";
  } else {
    const currentPageNo = pagination.currentPageNo;
    const pageSize = pagination.pageSize;
    const totalRecordCount = pagination.totalRecordCount;
    const recordCountPerPage = pagination.recordCountPerPage;

    const totalPageCount = Math.ceil(totalRecordCount / recordCountPerPage);
    const currentFirstPage =
      Math.floor((currentPageNo - 1) / pageSize) * pageSize + 1;
    let currentLastPage = currentFirstPage + pageSize - 1;
    currentLastPage =
      currentLastPage > totalPageCount ? totalPageCount : currentLastPage;

    if (totalPageCount > pageSize) {
      // 첫 페이지 이동
      const firstPageTag = (
        <li key="fp" className="btn">
          <button
            onClick={() => {
              moveToPage(1);
            }}
            className="first"
          >
            처음
          </button>
        </li>
      );
      paginationTag.push(firstPageTag);

      // 이전 페이지 이동
      const prevPageIndex = currentPageNo - 1 > 0 ? currentPageNo - 1 : 1;
      const previousPageTag = (
        <li key="pp" className="btn">
          <button
            onClick={() => {
              moveToPage(prevPageIndex);
            }}
            className="prev"
          >
            이전
          </button>
        </li>
      );
      paginationTag.push(previousPageTag);
    }

    for (let i = currentFirstPage; i <= currentLastPage; i++) {
      if (i === currentPageNo) {
        // 현재 페이지
        const currentPage = (
          <li key={i}>
            <button className="cur">{i}</button>
          </li>
        );
        paginationTag.push(currentPage);
      } else {
        // 다른 페이지
        const otherPage = (
          <li key={i}>
            <button
              onClick={() => {
                moveToPage(i);
              }}
            >
              {i}
            </button>
          </li>
        );
        paginationTag.push(otherPage);
      }
    }
    if (totalPageCount > pageSize) {
      // 다음 페이지 이동
      const nextPageIndex =
        currentLastPage + 1 < totalPageCount
          ? currentLastPage + 1
          : totalPageCount;
      const nextPageTag = (
        <li key="np" className="btn">
          <button
            onClick={() => {
              moveToPage(nextPageIndex);
            }}
            className="next"
          >
            다음
          </button>
        </li>
      );
      paginationTag.push(nextPageTag);

      // 마지막 페이지 이동
      const lastPageTag = (
        <li key="lp" className="btn">
          <button
            onClick={() => {
              moveToPage(totalPageCount);
            }}
            className="last"
          ></button>
        </li>
      );
      paginationTag.push(lastPageTag);
    }
  }
  return (
    <div className="paging">
      <ul>{paginationTag}</ul>
    </div>
  );
}
