import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create a Supabase client with the user's JWT
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    )

    // Get the current user from the JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const method = req.method

    // POST - Generate AI Roadmap
    if (method === 'POST') {
      const { assessmentData, careerGoals, currentSkills } = await req.json()

      if (!assessmentData) {
        return new Response(
          JSON.stringify({ error: 'Assessment data is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get OpenAI API key from environment
      const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
      if (!openaiApiKey) {
        return new Response(
          JSON.stringify({ error: 'AI service unavailable' }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Prepare the prompt for AI
      const prompt = `
        Based on the following assessment data, generate a personalized career roadmap:

        Assessment Score: ${assessmentData.score}%
        Category: ${assessmentData.category}
        Career Goals: ${careerGoals || 'Not specified'}
        Current Skills: ${currentSkills || 'Not specified'}

        Please provide a structured career roadmap with:
        1. Current skill assessment
        2. Recommended learning path (3-6 months)
        3. Career milestones (6-12 months)
        4. Long-term goals (1-2 years)
        5. Specific action items

        Format the response as JSON with the following structure:
        {
          "currentAssessment": "string",
          "learningPath": ["step1", "step2", ...],
          "milestones": ["milestone1", "milestone2", ...],
          "longTermGoals": ["goal1", "goal2", ...],
          "actionItems": ["item1", "item2", ...]
        }
      `

      // Call OpenAI API
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a career development AI assistant. Generate personalized career roadmaps based on assessment data.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      })

      if (!openaiResponse.ok) {
        return new Response(
          JSON.stringify({ error: 'Failed to generate roadmap' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const openaiData = await openaiResponse.json()
      const aiResponse = openaiData.choices[0]?.message?.content

      if (!aiResponse) {
        return new Response(
          JSON.stringify({ error: 'No response from AI service' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Parse the AI response (assuming it's JSON)
      let roadmap
      try {
        roadmap = JSON.parse(aiResponse)
      } catch (parseError) {
        // If parsing fails, create a structured response
        roadmap = {
          currentAssessment: 'Assessment completed successfully',
          learningPath: ['Continue learning and skill development'],
          milestones: ['Complete additional assessments', 'Network with professionals'],
          longTermGoals: ['Achieve career advancement', 'Build professional network'],
          actionItems: ['Update resume', 'Join professional communities']
        }
      }

      // Save the roadmap to database
      const { data, error } = await supabase
        .from('ai_roadmaps')
        .insert({
          user_id: user.id,
          assessment_id: assessmentData.id,
          roadmap_data: roadmap,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ roadmap, saved: true }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET - Get User's Roadmaps
    if (method === 'GET') {
      const { data, error } = await supabase
        .from('ai_roadmaps')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify(data),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Method not allowed
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
