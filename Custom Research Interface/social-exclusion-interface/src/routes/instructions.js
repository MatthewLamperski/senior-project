import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack';
import "react-pdf/dist/esm/Page/TextLayer.css";
import InstructionsPDF from '../instructions.pdf'
import {Link} from "react-router-dom";
const Instructions = () => {
  const [numPages, setNumPages] = useState(null)
  const [pageNum, setPageNum] = useState(1)
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }, [])
  const onDocLoadSuccess = useCallback(({numPages}) => {
    setNumPages(numPages)
  }, [])
  const previousPage = useCallback(() => {
    setPageNum(prevState => prevState - 1)
  }, [])
  const nextPage = useCallback(() => {
    setPageNum(prevState => prevState + 1)
  }, [])
  const canGoPrevPage = useMemo(() => {
    return pageNum !== 1
  }, [pageNum])
  const canGoNextPage = useMemo(() => {
    return pageNum !== numPages
  }, [pageNum, numPages])
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
      <div>
        <div style={{padding: 10, background: '#1a1a1a'}}>
          <Document file={InstructionsPDF} onLoadSuccess={onDocLoadSuccess} onLoadError={console.error}>
            <Page renderTextLayer={false} renderAnnotationLayer={false} pageNumber={pageNum} />
          </Document>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'stretch'}}>
          <button disabled={!canGoPrevPage} onClick={previousPage}>Previous</button>
          <p>
            Page {pageNum} of {numPages}
          </p>
          <button disabled={!canGoNextPage} onClick={nextPage}>Next</button>
        </div>
        {
          pageNum === numPages && (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
              <button style={{margin: 10}}>Disagree</button>
              <Link to="/captcha" style={{margin: 10}}>Agree</Link>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default Instructions;
