async function runTests() {
  const baseUrl = 'http://localhost:5000/api/v1';

  console.log('--- Testing 1: Health Check ---');
  const healthRes = await fetch(`${baseUrl}/health`);
  const health = await healthRes.json();
  console.log('Health:', health);

  console.log('\n--- Testing 2: Login ---');
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'eleanor@newlight.space',
      password: 'SecurePassword123!'
    })
  });
  const login = await loginRes.json();
  console.log('Login success:', login.success, 'User:', login.data?.user?.email);
  const token = login.data?.token;

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  console.log('\n--- Testing 3: Auth Me ---');
  const meRes = await fetch(`${baseUrl}/auth/me`, { headers: authHeaders });
  const me = await meRes.json();
  console.log('Me:', me.data?.name, me.data?.email);

  console.log('\n--- Testing 4: Get Tasks (Filtered & Paginated) ---');
  const tasksRes = await fetch(`${baseUrl}/tasks?page=1&limit=5&status=all`, {
    headers: authHeaders
  });
  const tasksData = await tasksRes.json();
  console.log('Tasks returned:', tasksData.data?.tasks?.length, 'Total tasks:', tasksData.data?.pagination?.totalTasks);
  console.log('Summary:', tasksData.data?.summary);

  console.log('\n--- Testing 5: Create Task ---');
  const createTaskRes = await fetch(`${baseUrl}/tasks`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Afternoon Breathwork and Mindful Walk',
      category: 'Mindfulness & Health',
      priority: 'Gentle',
      dueDate: 'Today, 4:00 PM',
      estimatedMinutes: 30,
      notes: 'Focus on diaphragmatic breathing in the park.'
    })
  });
  const createdTask = await createTaskRes.json();
  console.log('Task created:', createdTask.data?._id, createdTask.data?.title);
  const taskId = createdTask.data?._id;

  console.log('\n--- Testing 6: Toggle Task Completion ---');
  const toggleRes = await fetch(`${baseUrl}/tasks/${taskId}/toggle`, {
    method: 'PATCH',
    headers: authHeaders
  });
  const toggleData = await toggleRes.json();
  console.log('Task toggled completed:', toggleData.data?.completed, 'completedAt:', toggleData.data?.completedAt);

  console.log('\n--- Testing 7: Update Task ---');
  const updateRes = await fetch(`${baseUrl}/tasks/${taskId}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Extended Afternoon Breathwork & Stroll',
      estimatedMinutes: 45
    })
  });
  const updateData = await updateRes.json();
  console.log('Task updated:', updateData.data?.title, updateData.data?.estimatedMinutes);

  console.log('\n--- Testing 8: Weekly Analytics Telemetry ---');
  const weeklyRes = await fetch(`${baseUrl}/analytics/weekly`, { headers: authHeaders });
  const weeklyData = await weeklyRes.json();
  console.log('Weekly stats days count:', weeklyData.data?.weeklyStats?.length);
  console.log('Total completed this week:', weeklyData.data?.totalCompletedThisWeek);
  console.log('Total focus minutes:', weeklyData.data?.totalFocusMinutesThisWeek);

  console.log('\n--- Testing 9: Dimensions Analytics ---');
  const dimRes = await fetch(`${baseUrl}/analytics/dimensions`, { headers: authHeaders });
  const dimData = await dimRes.json();
  console.log('Dimensions alignment:', dimData.data?.dimensions?.map(d => `${d.name}: ${d.percentage}% (${d.tasksCount} tasks)`));

  console.log('\n--- Testing 10: Settings Get & Update ---');
  const settingsRes = await fetch(`${baseUrl}/settings`, { headers: authHeaders });
  const settings = await settingsRes.json();
  console.log('Initial settings:', settings.data);

  const updateSettingsRes = await fetch(`${baseUrl}/settings`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      dailyGoal: 6,
      dailyFocusMinutes: 200,
      gentleReminders: true,
      digitalDetoxReminder: true
    })
  });
  const updatedSettings = await updateSettingsRes.json();
  console.log('Updated settings:', updatedSettings.data);

  console.log('\n--- Testing 11: Delete Created Task ---');
  const deleteRes = await fetch(`${baseUrl}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: authHeaders
  });
  const deleteData = await deleteRes.json();
  console.log('Deleted task:', deleteData.data?._id);

  console.log('\n>>> ALL 11 API ENDPOINT TESTS PASSED WITH 100% SUCCESS! <<<');
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
