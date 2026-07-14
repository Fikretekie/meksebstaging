const API_URL = process.env.NEXT_PUBLIC_API_URL

// Create a new user profile in DynamoDB
export async function createUser(data: {
  userId: string
  email: string
  firstName: string
  lastName: string
  country: string
}) {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

// Create a new savings circle
export async function createCircle(data: {
  circleId: string
  name: string
  amount: number
  currency: string
  maxMembers: number
  goal: string
  description: string
  createdBy: string
}) {
  const res = await fetch(`${API_URL}/circles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

// Get dashboard data for a user
export async function getDashboard(userId: string) {
  const res = await fetch(`${API_URL}/dashboard?userId=${userId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  return res.json()
}

// Get all circles for a user
export async function getCircles(userId: string) {
  const res = await fetch(`${API_URL}/circles?userId=${userId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  return res.json()
}

// Record a payment
export async function makePayment(data: {
  paymentId: string
  userId: string
  circleId: string
  amount: number
  month: string
}) {
  const res = await fetch(`${API_URL}/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}