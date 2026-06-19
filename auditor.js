const express = require('express');
const solc = require('solc');
const ethers = require('ethers');

const app = express();
const PORT = 3000;

app.use(express.json());

// Vulnerability Detection
const vulnerabilities = {
  reentrancy: { name: 'Reentrancy', severity: 'HIGH' },
  overflow: { name: 'Integer Overflow', severity: 'HIGH' },
  unchecked: { name: 'Unchecked External Call', severity: 'MEDIUM' },
  accessControl: { name: 'Access Control', severity: 'HIGH' },
  txorigin: { name: 'TxOrigin Attack', severity: 'HIGH' },
  delegatecall: { name: 'Delegatecall Risk', severity: 'MEDIUM' },
  txvalue: { name: 'Txvalue Attack', severity: 'HIGH' },
  timestamp: { name: 'Timestamp Dependency', severity: 'MEDIUM' },
  visibility: { name: 'Visibility Issues', severity: 'LOW' },
  gasOptimization: { name: 'Gas Optimization', severity: 'LOW' }
};

function analyzeContract(contractCode) {
  const issues = [];
  if (contractCode.includes('call.value(')) issues.push(vulnerabilities.reentrancy);
  if (contractCode.includes('+') && contractCode.includes('uint')) issues.push(vulnerabilities.overflow);
  if (contractCode.includes('external') && contractCode.includes('function')) issues.push(vulnerabilities.unchecked);
  if (contractCode.includes('public') && !contractCode.includes('onlyOwner')) issues.push(vulnerabilities.accessControl);
  if (contractCode.includes('msg.sender') && contractCode.includes('tx.origin')) issues.push(vulnerabilities.txorigin);
  if (contractCode.includes('delegatecall')) issues.push(vulnerabilities.delegatecall);
  if (contractCode.includes('msg.value') && contractCode.includes('function')) issues.push(vulnerabilities.txvalue);
  if (contractCode.includes('block.timestamp')) issues.push(vulnerabilities.timestamp);
  if (contractCode.includes('function') && !contractCode.includes('public') && !contractCode.includes('private')) issues.push(vulnerabilities.visibility);
  if (contractCode.includes('storage') && contractCode.includes('memory')) issues.push(vulnerabilities.gasOptimization);
  return issues;
}

app.post('/api/analyze', (req, res) => {
  const { contractCode } = req.body;
  const issues = analyzeContract(contractCode);
  res.json({ success: true, issues, count: issues.length });
});

app.listen(PORT, () => console.log(`🚀 HOK Al Auditor running on port ${PORT}`));