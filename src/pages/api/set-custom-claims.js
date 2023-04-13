import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://iinvnrkknbtngnhpdrgv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpbnZucmtrbmJ0bmduaHBkcmd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA5NTE1NDMsImV4cCI6MTk5NjUyNzU0M30.iDqPX_7vsa994gt4_CZBP7qx9hJCAn1GU6KruydmpOw'
);


const setCustomClaims = async (req, res) => {
  
    const token = req.headers.authorization.split(' ')[1]
    const { error } = await supabase.auth.api.setAuth(token, { role: 'admin' })
  
    if (error) {
      res.status(500).json({ error: error.message })
    } else {
      res.status(200).json({ message: 'Custom claims set successfully' })
    }
  }
  
  export default setCustomClaims