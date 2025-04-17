import React, { useEffect, useState } from 'react';
import styles from '../Docs2/Docs2.module.css';
import Modal from '../Modal/Modal';
import { url2 } from '../../config/url';
import URL from '../../config/api';
import axios from 'axios';

const Docs2 = () => {
    const [newComment, setNewComment] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [comments, setComments] = useState([]);
    const [projectData, setProjectData] = useState({
        proposals: [],
        floorPlans: [],
        cad : [] , 
        salesAggrement : [] , 
        otherDocuments: [],
        presentation : []

    });
    const handleAddComment = async () => {
        const commentText = newComment.trim();
        if (!commentText || !selectedDoc?.fileUrl) return;
    
        const projectId = JSON.parse(localStorage.getItem('selectedProjectId'));
        const clientInfo = JSON.parse(localStorage.getItem('customerInfo'));
    
        // Convert fileUrl from / to \ (for backend Windows-style paths)
        let windowsPath = selectedDoc.fileUrl;
if (windowsPath.startsWith("/")) {
  windowsPath = windowsPath.substring(1);
}
    
        // Map title to category
        const titleToCategory = {
            'Detailed Proposal': 'proposals',
            'Options Presentation': 'presentation',
            'Floor Plan': 'floorPlans',
            'CAD File': 'cad',
            'Sales Agreement': 'salesAggrement',
        };
    
        const category = titleToCategory[selectedDoc?.title] || 'otherDocuments';
    
        try {
            await axios.post(`${URL}/projects/${projectId}/file-comments`, {
                comment: commentText,
                filePath: windowsPath, // raw Windows-style path (not encoded)
                clientId: clientInfo?.id, // corrected key name
                category,
            });
    
            setNewComment('');
            fetchComments(selectedDoc.fileUrl); // Refresh comments
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };
    
    
    const fetchProject = async () => {
        const projectId = JSON.parse(localStorage.getItem('selectedProjectId'));
        try {
            const res = await axios.get(`${URL}/projects/${projectId}`);
            const project = res.data;

            setProjectData({
                proposals: JSON.parse(project.proposals || '[]'),
                floorPlans: JSON.parse(project.floorPlans || '[]'),
                cad: JSON.parse(project.cad || '[]'),
                salesAggrement: JSON.parse(project.salesAggrement || '[]'),
                presentation: JSON.parse(project.presentation || '[]'),



                otherDocuments: JSON.parse(project.otherDocuments || '[]'),
            });
        } catch (err) {
            console.error('Failed to fetch project:', err);
        }
    };

    const fetchComments = async (fileUrl) => {
        if (!fileUrl) return;
        const projectId = JSON.parse(localStorage.getItem('selectedProjectId'));
    
        // Step 1: Convert / to \ to match backend format
        
    
        // Step 2: Encode manually so \ becomes %5C and other special chars are encoded
        let filePath = fileUrl;
        if (filePath.startsWith("/")) {
            filePath = filePath.substring(1);
        }
       
    
        try {
            const res = await axios.get(`${URL}/projects/${projectId}/file-comments` , 
                {
                    params: { filePath }
                  }
            );
            setComments(res.data || []);
        } catch (err) {
            console.error('Failed to fetch comments:', err);
        }
    };

    useEffect(() => {
        fetchProject();
    }, []);

    const handleCommentClick = (docTitle, fileUrl) => {
        const normalizedUrl = `/${fileUrl.replace(/\\/g, '/')}`;
        setSelectedDoc({ title: docTitle, fileUrl: normalizedUrl });
        fetchComments(normalizedUrl);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDoc(null);
        setComments([]);
    };

    const handleDoc = () => {
        if (selectedDoc?.fileUrl) {
            window.open(`${url2}${selectedDoc.fileUrl}`, '_blank');
        }
    };

    const docList = [
        {
            title: 'Detailed Proposal',
            icon: 'Svg/Coi.svg',
            fileUrl: projectData.proposals[0] || null,
        },
        {
            title: 'Options Presentation',
            icon: 'Svg/Coi.svg',
            fileUrl: projectData?.presentation[0] || null, // Placeholder
        },
        {
            title: 'Floor Plan',
            icon: 'Svg/Coi.svg',
            fileUrl: projectData.floorPlans[0] || null,
        },
        {
            title: 'CAD File',
            icon: 'Svg/Coi.svg',
            fileUrl: projectData?.cad[0] || null // Placeholder
        },
        {
            title: 'Sales Agreement',
            icon: 'Svg/Coi.svg',
            fileUrl:  projectData?.salesAggrement[0] ||null, // Placeholder
        },
    ];

    return (
        <div>
            <div className={styles.container}>
                {docList.map((doc, index) => (
                    <div key={index} className={styles.card}>
                        <div className={styles.left}>
                            <div className={styles.icon}>
                                <img src={doc.icon} alt={doc.title} />
                            </div>
                            <span className={styles.title}>{doc.title}</span>
                        </div>

                        {doc.fileUrl ? (
                            <div
                                className={styles.commentLink}
                                onClick={() => handleCommentClick(doc.title, doc.fileUrl)}
                            >
                                <img src="Svg/edit-icon.svg" alt="comment" />
                                <p>Comment</p>
                            </div>
                        ) : (
                            <div className={styles.noFile}>
                                <p style={{ color: 'gray', fontSize: '12px' }}>Not uploaded yet</p>
                            </div>
                        )}
                    </div>
                ))}

                {/* <p className={styles.note}>
                    If all documents are updated, ignore this; otherwise, <b>update</b> the <b>latest one</b>.
                </p> */}
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} height="80vh">
                <div className={styles.modalInner}>
                    <h2 className={styles.modalTitle}>{selectedDoc?.title}</h2>

                    {selectedDoc?.fileUrl && (
                        <div className={styles.previewBox}>
                            {selectedDoc.fileUrl.endsWith('.pdf') ? (
                                <>
                                    {/* <img src="Svg/pdf.svg" alt="PDF" /> */}
                                    <iframe 
                                    src='http://localhost:5000/uploads/projects/1744803924788-pkpadmin,+1008-4741-1-CE.pdf' />
                                    <div onClick={handleDoc}>View PDF</div>
                                </>
                            ) : (
                                <img
                                    src={`${url2}${selectedDoc?.fileUrl}`}
                                    alt={selectedDoc?.title}
                                    style={{
                                        width: '100%',
                                        maxHeight: '400px',
                                        borderRadius: '8px',
                                        objectFit: 'contain',
                                    }}
                                />
                            )}
                        </div>
                    )}

                    {comments?.length > 0 &&
                        comments.map((item, index) => (
                            <div className={styles.commentList} key={index}>
                                <div className={styles.commentBubble}  style={{
  backgroundColor: item.customer ? "red" : "blue"
}} >
                                <p>
  {item.comment}
</p>
                                </div>
                                {item?.user?.userRole ?  <span>
                                    {new Date(item.createdAt)
                                        .toLocaleString('en-GB', {
                                            day: '2-digit',
                                            month: 'long',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true,
                                        })
                                        .replace(',', '')}{' '}
                                    by {item?.user?.userRole}
                                </span>:  <span>
                                {new Date(item.createdAt)
                                        .toLocaleString('en-GB', {
                                            day: '2-digit',
                                            month: 'long',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true,
                                        })
                                        .replace(',', '')}{' '}
                                   
                                </span> }
                               
                            </div>
                        ))}

<div className={styles.commentInput}>
    <input
        type="text"
        placeholder="Comment or (Leave your thought here)"
        className={styles.inputBox}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
    />
    <button className={styles.commentButton} onClick={handleAddComment}>
        COMMENT
    </button>
</div>

                </div>
            </Modal>
        </div>
    );
};

export default Docs2;
