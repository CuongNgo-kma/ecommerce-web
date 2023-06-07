import React, { useContext } from 'react'
import { globalState } from '../../../globalState'

function LoadMore() {
    const state = useContext(globalState)
    const [page, setPage] = state.ProductAPI.page
    const [result] = state.ProductAPI.result

    return (
        <div className="load_more">
            {
                result < page * 9 ? ""
                    : <button onClick={() => setPage(page + 1)}>Load more</button>
            }
        </div>
    )
}

export default LoadMore