import { fetchAuthSession } from 'aws-amplify/auth'

export async function getUserAttributes() {
  const session = await fetchAuthSession()

  if (!session.tokens) {
    throw new Error('No tokens')
  }

  const payload = session.tokens.idToken?.payload
  return {
    email: (payload?.email as string) || '',
    sub: (payload?.sub as string) || '',
    given_name: (payload?.given_name as string) || '',
    family_name: (payload?.family_name as string) || '',
  }
}