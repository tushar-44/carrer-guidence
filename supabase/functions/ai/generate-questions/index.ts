import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

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

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { interests, previousAnswers, difficulty } = await req.json()

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'AI service unavailable' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const prompt = `
      Generate 5 adaptive career assessment questions based on:
      
      User Interests: ${interests?.join(', ') || 'General career exploration'}
      Previous Answers: ${JSON.stringify(previousAnswers || {})}
      Difficulty Level: ${difficulty || 'intermediate'}
      
      Generate questions that help identify:
      1. Career interests and motivations
      2. Skill strengths and gaps
      3. Work style preferences
      4. Learning preferences
      5. Long-term career goals
      
      Return a JSON array with this exact structure:
      [
        {
          "id": "unique_id",
          "question": "Question text",
          "type": "single" | "multiple" | "scale",
          "options": ["option1", "option2", ...],
          "category": "category_name",
          "weight": 1-3
        }
      ]
      
      Make questions engaging, relevant, and insightful.
    `

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
            content: 'You are a career assessment expert. Generate insightful questions that help identify career paths.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.8,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error('Failed to generate questions')
    }

    const openaiData = await openaiResponse.json()
    const aiResponse = openaiData.choices[0]?.message?.content

    let questions
    try {
      questions = JSON.parse(aiResponse)
    } catch (parseError) {
      // Fallback questions if parsing fails
      questions = [
        {
          id: 'q1',
          question: 'What type of work environment energizes you most?',
          type: 'single',
          options: ['Fast-paced startup', 'Established corporation', 'Remote/Flexible', 'Non-profit'],
          category: 'work-environment',
          weight: 2
        }
      ]
    }

    return new Response(
      JSON.stringify({ questions }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})