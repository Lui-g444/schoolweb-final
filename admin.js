import { supabase } from './supabaseClient.js';

// 🔐 Login function
window.login = async () => {
  const email = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPassword').value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    alert('❌ Login failed: ' + error.message);
  } else {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    fetchApplicants();
  }
};

// 🔐 Session check on page load
const checkSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    fetchApplicants();
  }
};

checkSession();

// 🔄 Logout button
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await supabase.auth.signOut();
  location.reload();
});

// 📋 Fetch applicants
async function fetchApplicants() {
  const { data, error } = await supabase.from('students').select('*');
  if (error) {
    console.error('❌ Error fetching applicants:', error.message);
    return;
  }
  renderTable(data);
}

// 📊 Render table + analytics
function renderTable(applicants) {
  const searchTerm = searchInput.value.toLowerCase();
  const program = programFilter.value;
  const status = statusFilter.value;

  const filtered = applicants.filter(app => {
    const matchesSearch = app.full_name.toLowerCase().includes(searchTerm) || app.email.toLowerCase().includes(searchTerm);
    const matchesProgram = program ? app.program === program : true;
    const matchesStatus = status ? app.status === status : true;
    return matchesSearch && matchesProgram && matchesStatus;
  });

  // Analytics
  const analyticsEl = document.getElementById('analytics');
  const total = applicants.length;
  const accepted = applicants.filter(a => a.status === 'Accepted').length;
  const pending = applicants.filter(a => a.status === 'Pending').length;
  const rejected = applicants.filter(a => a.status === 'Rejected').length;

  analyticsEl.innerHTML = `
    <strong>Total:</strong> ${total} |
    <strong>Accepted:</strong> ${accepted} |
    <strong>Pending:</strong> ${pending} |
    <strong>Rejected:</strong> ${rejected}
  `;

  // Table
  tableBody.innerHTML = '';
  filtered.forEach(app => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${app.full_name}</td>
      <td>${app.email}</td>
      <td>${app.program}</td>
      <td>
        <select class="statusDropdown" data-id="${app.id}">
          <option value="Pending" ${app.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Under Review" ${app.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
          <option value="Accepted" ${app.status === 'Accepted' ? 'selected' : ''}>Accepted</option>
          <option value="Rejected" ${app.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
        </select>
      </td>
      <td>${app.message || ''}</td>
    `;
    tableBody.appendChild(row);
  });

  document.querySelectorAll('.statusDropdown').forEach(dropdown => {
    dropdown.addEventListener('change', async (e) => {
      const id = e.target.dataset.id;
      const newStatus = e.target.value;

      const { error } = await supabase
        .from('students')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        alert('❌ Failed to update status: ' + error.message);
      } else {
        alert('✅ Status updated to ' + newStatus);
      }
    });
  });
}

// 🔍 Filters
const tableBody = document.querySelector('#applicantsTable tbody');
const searchInput = document.getElementById('searchInput');
const programFilter = document.getElementById('programFilter');
const statusFilter = document.getElementById('statusFilter');

searchInput.addEventListener('input', fetchApplicants);
programFilter.addEventListener('change', fetchApplicants);
statusFilter.addEventListener('change', fetchApplicants);

// 📤 Export to CSV
document.getElementById('exportBtn').addEventListener('click', () => {
  const rows = [['Full Name', 'Email', 'Program', 'Status', 'Message']];
  document.querySelectorAll('#applicantsTable tbody tr').forEach(tr => {
    const cells = Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim());
    rows.push(cells);
  });

  const csvContent = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'nerdford_applicants.csv';
  link.click();
});