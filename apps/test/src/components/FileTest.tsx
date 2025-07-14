import { useState } from 'react';
import { useFileUpload, useFileUploadWithInfo, useFileInfo } from '@plug/common-services';

const FileTest = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [manualFileId, setManualFileId] = useState<string>('');

  // 1. 기본 파일 업로드 (Response 전체 반환)
  const { 
    execute: uploadFile, 
    error: uploadError, 
    isLoading: uploadLoading, 
    isSuccess: uploadSuccess, 
    data: uploadData 
  } = useFileUpload();

  // 2. 파일 업로드 + 자동 파일 정보 조회
  const { 
    execute: uploadWithAutoFetch, 
    error: uploadAutoError, 
    isLoading: uploadAutoLoading, 
    isSuccess: uploadAutoSuccess, 
    data: uploadAutoData,
    fileInfo: autoFetchedFileInfo,
    isLoadingFileInfo: isLoadingAutoFileInfo,
    fileInfoError: autoFileInfoError,
    clearFileInfo: clearAutoFileInfo
  } = useFileUploadWithInfo();

  // 3. 수동 파일 정보 조회
  const { 
    execute: fetchFileInfo, 
    error: fileInfoError, 
    isLoading: fileInfoLoading, 
    isSuccess: fileInfoSuccess, 
    data: fileInfoData 
  } = useFileInfo(manualFileId);

  return (
    <div>
      <h2>📁 파일 업로드 API 테스트</h2>

      {/* 에러 표시 */}
      {(uploadError || uploadAutoError || fileInfoError || autoFileInfoError) && (
        <div style={{ 
          padding: "10px", 
          backgroundColor: "#f8d7da", 
          color: "#721c24", 
          borderRadius: "4px", 
          marginBottom: "20px",
          border: "1px solid #f5c6cb"
        }}>
          <strong>❌ 오류 발생:</strong>
          <br />
          {uploadError?.message || 
           uploadAutoError?.message || 
           fileInfoError?.message || 
           autoFileInfoError?.message || 
           "알 수 없는 오류가 발생했습니다."}
        </div>
      )}

      {/* 성공 표시 */}
      {(uploadSuccess || uploadAutoSuccess || fileInfoSuccess) && (
        <div style={{ 
          padding: "10px", 
          backgroundColor: "#d4edda", 
          color: "#155724", 
          borderRadius: "4px", 
          marginBottom: "20px",
          border: "1px solid #c3e6cb"
        }}>
          <strong>✅ 성공:</strong> 요청이 성공적으로 처리되었습니다.
        </div>
      )}

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* 파일 선택 영역 */}
        <div style={{
          flex: "1",
          minWidth: "300px",
          border: "1px solid #eee",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#f8f9fa"
        }}>
          <h3>📤 파일 업로드</h3>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "600",
              color: "#495057"
            }}>
              파일 선택:
            </label>
            <input
              type="file"
              onChange={(e) => {
                setSelectedFile(e.target.files?.[0] || null);
                // 파일 변경 시 이전 결과 초기화
                clearAutoFileInfo();
              }}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ced4da",
                boxSizing: "border-box",
                backgroundColor: "white"
              }}
            />
          </div>
          
          {/* 1. 기본 업로드 버튼 */}
          <button
            onClick={async () => {
              if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                await uploadFile(formData);
              }
            }}
            disabled={!selectedFile || uploadLoading}
            style={{
              padding: "12px 16px",
              backgroundColor: uploadLoading ? "#6c757d" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: selectedFile && !uploadLoading ? "pointer" : "not-allowed",
              width: "100%",
              marginBottom: "12px",
              fontWeight: "500",
              opacity: !selectedFile ? 0.6 : 1,
            }}
          >
            {uploadLoading ? "📤 업로드 중..." : "📤 기본 업로드 (Response만)"}
          </button>

          {/* 2. 자동 조회 업로드 버튼 */}
          <button
            onClick={async () => {
              if (selectedFile) {
                await uploadWithAutoFetch(selectedFile);
              }
            }}
            disabled={!selectedFile || uploadAutoLoading}
            style={{
              padding: "12px 16px",
              backgroundColor: uploadAutoLoading ? "#6c757d" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: selectedFile && !uploadAutoLoading ? "pointer" : "not-allowed",
              width: "100%",
              marginBottom: "20px",
              fontWeight: "500",
              opacity: !selectedFile ? 0.6 : 1,
            }}
          >
            {uploadAutoLoading ? "📤 업로드 중..." : "📤 업로드 + 자동 파일정보 조회"}
          </button>

          {/* 수동 파일 정보 조회 */}
          <div style={{ 
            borderTop: "1px solid #dee2e6", 
            paddingTop: "20px",
            marginTop: "20px"
          }}>
            <h4 style={{ marginBottom: "12px", color: "#495057" }}>🔍 수동 파일 정보 조회</h4>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "5px", 
                fontWeight: "500",
                color: "#495057"
              }}>
                파일 ID:
              </label>
              <input
                type="text"
                value={manualFileId}
                onChange={(e) => setManualFileId(e.target.value)}
                placeholder="조회할 파일 ID 입력"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ced4da",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <button
              onClick={() => fetchFileInfo()}
              disabled={!manualFileId || fileInfoLoading}
              style={{
                padding: "10px 16px",
                backgroundColor: fileInfoLoading ? "#6c757d" : "#17a2b8",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: manualFileId && !fileInfoLoading ? "pointer" : "not-allowed",
                width: "100%",
                fontWeight: "500",
                opacity: !manualFileId ? 0.6 : 1,
              }}
            >
              {fileInfoLoading ? "🔍 조회 중..." : "🔍 파일 정보 조회"}
            </button>
          </div>
        </div>

        {/* 결과 표시 영역 */}
        <div style={{
          flex: "2",
          minWidth: "400px",
          border: "1px solid #eee",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "white"
        }}>
          <h3>📋 결과 표시</h3>

          {/* 1. 기본 업로드 결과 */}
          {uploadData && (
            <div style={{ marginBottom: "25px" }}>
              <h4 style={{ 
                color: "#007bff", 
                marginBottom: "12px",
                borderBottom: "2px solid #007bff",
                paddingBottom: "4px"
              }}>
                📤 기본 업로드 결과
              </h4>
              <div style={{ 
                padding: "15px", 
                backgroundColor: "#e7f3ff", 
                borderLeft: "4px solid #007bff",
                borderRadius: "4px",
                fontSize: "14px" 
              }}>                  <div style={{ display: "grid", gap: "6px" }}>
                    <div><strong>상태 코드:</strong> {uploadData.response?.status || 'N/A'}</div>
                    <div><strong>성공 여부:</strong> 
                      <span style={{ 
                        marginLeft: "8px",
                        padding: "2px 8px", 
                        backgroundColor: uploadData.response?.ok ? "#28a745" : "#dc3545", 
                        color: "white", 
                        borderRadius: "3px", 
                        fontSize: "12px" 
                      }}>
                        {uploadData.response?.ok ? "✅ 성공" : "❌ 실패"}
                      </span>
                    </div>
                    {uploadData.response?.headers.get('Location') && (
                      <div style={{ marginTop: "8px" }}>
                        <strong>Location:</strong>
                        <div style={{ 
                          fontSize: "12px", 
                          backgroundColor: "#f8f9fa", 
                          padding: "6px",
                          borderRadius: "3px",
                          marginTop: "4px",
                          wordBreak: "break-all",
                          fontFamily: "monospace"
                        }}>
                          {uploadData.response.headers.get('Location')}
                        </div>
                      </div>
                    )}
                  </div>
              </div>
              
              <details style={{ marginTop: "10px" }}>
                <summary style={{ 
                  cursor: "pointer", 
                  fontWeight: "bold", 
                  padding: "8px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                  border: "1px solid #dee2e6"
                }}>
                  🔍 원시 응답 데이터
                </summary>
                <pre style={{
                  padding: "12px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                  overflow: "auto",
                  fontSize: "12px",
                  marginTop: "8px",
                  border: "1px solid #dee2e6",
                  maxHeight: "200px"
                }}>
                  {JSON.stringify(uploadData, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {/* 2. 자동 조회 업로드 결과 */}
          {(uploadAutoData || autoFetchedFileInfo || isLoadingAutoFileInfo) && (
            <div style={{ marginBottom: "25px" }}>
              <h4 style={{ 
                color: "#28a745", 
                marginBottom: "12px",
                borderBottom: "2px solid #28a745",
                paddingBottom: "4px"
              }}>
                📤 업로드 + 자동 파일정보 조회 결과
              </h4>
              
              {/* 업로드 결과 */}
              {uploadAutoData && (
                <div style={{ marginBottom: "15px" }}>
                  <div style={{ 
                    padding: "12px", 
                    backgroundColor: "#d4edda", 
                    borderLeft: "4px solid #28a745",
                    borderRadius: "4px",
                    fontSize: "14px" 
                  }}>
                    <div style={{ fontWeight: "bold", color: "#155724", marginBottom: "8px" }}>
                      ✅ 업로드 성공
                    </div>
                    <div style={{ display: "grid", gap: "4px" }}>
                      <div><strong>상태 코드:</strong> {uploadAutoData.response?.status || 'N/A'}</div>
                      <div><strong>성공 여부:</strong> 
                        <span style={{ 
                          marginLeft: "6px",
                          padding: "2px 6px", 
                          backgroundColor: uploadAutoData.response?.ok ? "#28a745" : "#dc3545", 
                          color: "white", 
                          borderRadius: "3px", 
                          fontSize: "12px" 
                        }}>
                          {uploadAutoData.response?.ok ? "성공" : "실패"}
                        </span>
                      </div>
                      {uploadAutoData.response?.headers.get('Location') && (
                        <div style={{ marginTop: "4px" }}>
                          <strong>Location:</strong>
                          <div style={{ 
                            fontSize: "12px", 
                            backgroundColor: "#f8f9fa", 
                            padding: "4px 6px",
                            borderRadius: "3px",
                            marginTop: "2px",
                            wordBreak: "break-all"
                          }}>
                            {uploadAutoData.response.headers.get('Location')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 파일 정보 로딩 상태 */}
              {isLoadingAutoFileInfo && (
                <div style={{ 
                  padding: "12px", 
                  backgroundColor: "#fff3cd", 
                  borderLeft: "4px solid #ffc107",
                  borderRadius: "4px",
                  fontSize: "14px",
                  marginBottom: "15px"
                }}>
                  <div style={{ fontWeight: "bold", color: "#856404" }}>
                    🔄 파일 정보 조회 중...
                  </div>
                </div>
              )}

              {/* 자동 조회된 파일 정보 */}
              {autoFetchedFileInfo && (
                <div style={{ marginBottom: "15px" }}>
                  <div style={{ 
                    padding: "12px", 
                    backgroundColor: "#d1ecf1", 
                    borderLeft: "4px solid #17a2b8",
                    borderRadius: "4px",
                    fontSize: "14px" 
                  }}>
                    <div style={{ fontWeight: "bold", color: "#0c5460", marginBottom: "8px" }}>
                      📄 자동 조회된 파일 정보
                    </div>
                    <div style={{ display: "grid", gap: "4px" }}>
                      <div><strong>파일 ID:</strong> {autoFetchedFileInfo.id}</div>
                      <div><strong>원본 파일명:</strong> {autoFetchedFileInfo.originalFileName}</div>
                      <div><strong>콘텐츠 타입:</strong> {autoFetchedFileInfo.contentType}</div>
                      <div><strong>파일 상태:</strong> 
                        <span style={{ 
                          marginLeft: "6px",
                          padding: "2px 6px", 
                          backgroundColor: "#28a745", 
                          color: "white", 
                          borderRadius: "3px", 
                          fontSize: "12px" 
                        }}>
                          {autoFetchedFileInfo.fileStatus}
                        </span>
                      </div>
                      {autoFetchedFileInfo.url && (
                        <div style={{ marginTop: "8px" }}>
                          <strong>파일 URL:</strong>
                          <div style={{ 
                            backgroundColor: "#f8f9fa", 
                            padding: "6px",
                            borderRadius: "3px",
                            marginTop: "4px",
                            border: "1px solid #dee2e6"
                          }}>
                            <a 
                              href={autoFetchedFileInfo.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ 
                                color: "#007bff", 
                                textDecoration: "none",
                                fontSize: "13px",
                                wordBreak: "break-all"
                              }}
                            >
                              🔗 {autoFetchedFileInfo.url}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. 수동 조회 파일 정보 */}
          {fileInfoData && (
            <div style={{ marginBottom: "25px" }}>
              <h4 style={{ 
                color: "#17a2b8", 
                marginBottom: "12px",
                borderBottom: "2px solid #17a2b8",
                paddingBottom: "4px"
              }}>
                🔍 수동 조회 파일 정보
              </h4>
              <div style={{ 
                padding: "12px", 
                backgroundColor: "#d1ecf1", 
                borderLeft: "4px solid #17a2b8",
                borderRadius: "4px",
                fontSize: "14px" 
              }}>
                <div style={{ display: "grid", gap: "4px" }}>
                  <div><strong>파일 ID:</strong> {fileInfoData.id}</div>
                  <div><strong>원본 파일명:</strong> {fileInfoData.originalFileName}</div>
                  <div><strong>파일 타입:</strong> {fileInfoData.fileType}</div>
                  <div><strong>콘텐츠 타입:</strong> {fileInfoData.contentType}</div>
                  <div><strong>파일 상태:</strong> 
                    <span style={{ 
                      marginLeft: "6px",
                      padding: "2px 6px", 
                      backgroundColor: "#28a745", 
                      color: "white", 
                      borderRadius: "3px", 
                      fontSize: "12px" 
                    }}>
                      {fileInfoData.fileStatus}
                    </span>
                  </div>
                  {fileInfoData.url && (
                    <div style={{ marginTop: "8px" }}>
                      <strong>파일 URL:</strong>
                      <div style={{ 
                        backgroundColor: "#f8f9fa", 
                        padding: "6px",
                        borderRadius: "3px",
                        marginTop: "4px",
                        border: "1px solid #dee2e6"
                      }}>
                        <a 
                          href={fileInfoData.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ 
                            color: "#007bff", 
                            textDecoration: "none",
                            fontSize: "13px",
                            wordBreak: "break-all"
                          }}
                        >
                          🔗 {fileInfoData.url}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <details style={{ marginTop: "10px" }}>
                <summary style={{ 
                  cursor: "pointer", 
                  fontWeight: "bold", 
                  padding: "8px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                  border: "1px solid #dee2e6"
                }}>
                  🔍 원시 데이터 보기
                </summary>
                <pre style={{
                  padding: "12px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                  overflow: "auto",
                  fontSize: "12px",
                  marginTop: "8px",
                  border: "1px solid #dee2e6",
                  maxHeight: "200px"
                }}>
                  {JSON.stringify(fileInfoData, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {/* 데이터가 없을 때 안내 메시지 */}
          {!uploadData && !uploadAutoData && !autoFetchedFileInfo && !fileInfoData && !isLoadingAutoFileInfo && (
            <div style={{
              padding: "40px 20px",
              textAlign: "center",
              color: "#6c757d",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              border: "2px dashed #dee2e6"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📄</div>
              <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px" }}>
                결과가 여기에 표시됩니다
              </div>
              <div style={{ fontSize: "14px" }}>
                파일을 선택하고 업로드하거나 파일 ID로 조회해보세요.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileTest;
