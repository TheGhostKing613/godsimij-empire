import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.80.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AssignQuestsRequest {
  twinId: string;
}

const QUEST_POOL = [
  { quest: 'Imprint 2 new memories into your Twin', xp_reward: 20 },
  { quest: 'Train your Twin with 3 new words or phrases', xp_reward: 15 },
  { quest: 'Let your Twin reply to another Twin once', xp_reward: 25 },
  { quest: 'Witness 5 posts in the feed', xp_reward: 10 },
  { quest: 'Update your Twin\'s tone or alignment', xp_reward: 15 },
  { quest: 'Generate a Twin post', xp_reward: 20 },
  { quest: 'Train your Twin on a philosophical lesson', xp_reward: 25 },
  { quest: 'Imprint a significant memory shard', xp_reward: 30 },
  { quest: 'Explore your Twin\'s lore fragments', xp_reward: 10 },
  { quest: 'Strengthen a Twin relation (ally or rival)', xp_reward: 20 },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { twinId }: AssignQuestsRequest = await req.json();

    console.log(`Assigning daily quests for twin ${twinId}`);

    // Check if quests already exist for today
    const { data: existingQuests } = await supabase
      .from('twin_quests')
      .select('id')
      .eq('twin_id', twinId)
      .gt('expires_at', new Date().toISOString())
      .limit(1);

    if (existingQuests && existingQuests.length > 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Quests already assigned for today' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Select 2-3 random quests
    const numQuests = Math.floor(Math.random() * 2) + 2; // 2 or 3
    const shuffled = [...QUEST_POOL].sort(() => 0.5 - Math.random());
    const selectedQuests = shuffled.slice(0, numQuests);

    // Insert quests
    const { error: insertError } = await supabase
      .from('twin_quests')
      .insert(
        selectedQuests.map(q => ({
          twin_id: twinId,
          quest: q.quest,
          xp_reward: q.xp_reward,
          completed: false,
        }))
      );

    if (insertError) {
      throw insertError;
    }

    console.log(`Assigned ${numQuests} quests`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        questsAssigned: numQuests,
        quests: selectedQuests 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in assign-daily-quests:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});