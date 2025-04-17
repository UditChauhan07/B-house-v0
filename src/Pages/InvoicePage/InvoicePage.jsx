import React, { useState, useEffect } from 'react';
import HeaderTab from '../../Components/HeaderTab/HeaderTab'
import Footer from '../../Components/Footer/Footer'
import Chart from '../../Components/Invoice/Chart/Chart.jsx'
import List from '../../Components/Invoice/List/List.jsx'
import axios from 'axios';
import URL from '../../config/api.js';
import Loader from '../../Components/Loader/Loader'
const InvoicePage = () => {
     const [totalCost, setTotalCost] = useState();
        const [totalPaidAmount, setTotalPaidAmount] = useState(0);
        const [remaining, setRemaining] = useState(0);
        const projectId = localStorage.getItem('selectedProjectId');
        useEffect(() => {
            const fetchFinanceData = async () => {
                try {
                    const projectRes = await axios.get(`${URL}/projects/${projectId}`);
                    const project = projectRes.data;
        
                    const baseTotalAmount = Number(project.totalValue || 0);
                    const baseAdvance = Number(project.advancePayment || 0);
        
                    let invoices = [];
                    
                    try {
                        const invoiceRes = await axios.get(`${URL}/projects/${projectId}/invoice`);
                        invoices = Array.isArray(invoiceRes.data) ? invoiceRes.data : [invoiceRes.data];
                    } catch (invoiceErr) {
                        if (invoiceErr.response && invoiceErr.response.status === 404) {
                            // No invoices, use only project data
                            setTotalCost(baseTotalAmount);
                            setTotalPaidAmount(baseAdvance);
                            setRemaining(baseTotalAmount - baseAdvance);
                            return;
                        } else {
                            // Some other error — rethrow
                            throw invoiceErr;
                        }
                    }
        
                    // Invoices exist — continue with full logic
                    const invoiceTotal = invoices.reduce((sum, invoice) => sum + Number(invoice.totalAmount || 0), 0);
                    const totalProjectCost = Math.max(baseTotalAmount, invoiceTotal);
        
                    const paidFromInvoices = invoices.reduce((sum, invoice) => {
                        let paid = 0;
                        if (invoice.status === 'Paid') {
                            paid += Number(invoice.totalAmount || 0);
                        } else {
                            paid += Number(invoice.advancePaid || 0);
                        }
                        return sum + paid;
                    }, 0);
        
                    const totalPaid = baseAdvance + paidFromInvoices;
                    const balanceDue = totalProjectCost - totalPaid;
        
                    setTotalCost(totalProjectCost);
                    setTotalPaidAmount(totalPaid);
                    setRemaining(balanceDue);
                } catch (err) {
                    console.error('Error fetching finance data:', err);
                }
            };
        
            if (projectId) {
                fetchFinanceData();
            }
        }, [projectId]);
        console.log(totalCost , "total cost")
    return (
        <div>
            <div className="HeaderTop">
                <HeaderTab title='Invoice List' />
            </div>
            {!totalCost? <Loader/> : <>  <Chart />
                <List /></>}
          

            <Footer />
        </div>
    )
}

export default InvoicePage
