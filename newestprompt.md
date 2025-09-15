Create a comprehensive TypeScript React NFL Sports Analytics Dashboard for machine learning-powered game predictions. This is a sports data analysis platform that is centered around the predictions, saving predictions, and an incredible 
  UX. It also includes a SIMULATED
     betting function, where the user starts with x "dollars" and has the option to simulate bets on winning teams and tracking of their simulated account value based on the predictions they've made, as well as saving predictions and tracking historical accuracy of the 
  ML 
    model.



    Required Dashboard Components, at least:

    Team selector dropdown with all 32 NFL teams (logos, colors, records)

    Game browser interface for browsing current and upcoming NFL games with intuitive UX

    Prediction results display with game matchup cards

    Team-branded styling using NFL team colors and logos

    Win probability visualization with subtly animated progress bars

    Game details display (teams, time, venue, status)

    Prediction confidence percentage display

    Point spread and analysis metrics

    Incorporate click-based shimmer effects on interactive components, both radial and linear directions

    Accessibility-compliant animations (respect reduced motion preferences)



    Technical Integration:

    Connect to Flask API endpoints (localhost:5001)

    Multiple prediction display types:

    1. Handle single game predictions by manually selecting two teams

    2. Handle bulk predictions by manually selecting a date

    3. Handle easily browsing current and upcoming games in an intuitive UX 

    Display real-time game status (Scheduled, Live, Final)

    Team performance analytics with 13-game rolling averages

    Prediction management (save, manually edit fields in already-made predictions, delete predictions)

    Performance tracking with accuracy calculations



    Sports Data Display:

    Live game indicators with status badges

    Current/final scores when available

    Prediction vs actual outcome comparisons

    Game scheduling with venue information

    Team records and recent form analysis



    Design Requirements:

    A lot of subtle microinteractions that don't kill performance 

    Transparency effects with very minimal blurring

    Modern dark/light theme with premium feel

    **Responsive design** 

    Consider multiple platforms, desktop and mobile 

    Professional sports analytics aesthetic

    Team logo integration with proper fallbacks

    Clean data visualization patterns





    Technical Architecture:

      Frontend Stack:

      - React 19 with TypeScript

      - Vite for build tooling

      - Tailwind v4 with OKLCH color space

      - Framer Motion for animations

      - Radix UI

      - shadcn/ui 



      Backend (already built) Integration:

      - Flask API running on localhost:5001

      - Machine Learning Pipeline: Pre-trained model with scaler

      - Feature Engineering: 12-feature vector processing

      - Data Sanitization: Robust error handling and validation

      - Performance Metrics: Real accuracy tracking



      API Endpoints Integration:

      - POST /predict - Single game prediction

      - POST /bulk_predictions - Date-based batch predictions

      - GET /games?date=YYYY-MM-DD - Fetch games for date

      - POST /save_prediction - Store prediction with duplicate check

      - GET /predictions - Retrieve all saved predictions

      - PUT /predictions/:id - Update existing prediction

      - DELETE /predictions/:id - Remove prediction

      - GET /model_performance - Real-time accuracy stats





    Focus on creating a sophisticated sports analytics platform that presents machine learning predictions in an engaging, professional yet STUNNING sleek interface for sports prediction analysis and performance visualization.



    <THE_HOLY_SHIT_FACTOR> 

    The fundamental design intent should be what is known as “The ‘Holy shit’ factor”. This is the concept of designing something so stunning and amazing that the literal goal is to have the user literally say “Holy Shit” when they open it and continue using it. This 
  isn't
     simply a catchy phrase; it embodies a profound design philosophy centered on creating an experience so utterly remarkable, unexpected, and overwhelmingly positive that it elicits a spontaneous, visceral expression of astonishment from the user upon their initial 
    encounter or key interaction. At its core, The ‘Holy Shit’ Factor is the deliberate act of designing something – be it a product, a service, a piece of software, packaging, or an environment – that so dramatically exceeds expectations, demonstrates such 
  uncompromising 
    quality, exhibits such astounding ingenuity, or presents such unexpected delight that the user's immediate, unfiltered reaction is one of genuine awe. The literal goal is to craft a moment of impact where the user's internal processor, overwhelmed by the sheer 
    brilliance or unexpected generosity of the design, defaults to that universally understood exclamation of surprise and impressed disbelief: "Holy Shit!" This is far more than just looking good or working correctly. It's about engineering moments of truth that are not
   
    merely satisfactory, but truly exceptional. It's about identifying opportunities in the user journey – particularly the initial unboxing, first launch, or critical interaction – and injecting them with an intensity of quality, OBVIOUS thoughtfulness, or performance 
    that shatters preconceived notions. Achieving The ‘Holy Shit’ Factor requires a design philosophy that is meticulous, empathetic, and daring. It demands obsessive attention to the fine details, a deep understanding of the user's latent desires and potential points of
   
    friction, and a willingness to push boundaries beyond conventional solutions. It manifests through: Uncompromising Craftsmanship: Flawless execution, premium materials, and evident care in construction. Unexpected Functionality/Performance: The product does something
   
    far better, or in a way you never imagined possible. Intuitive Magic: The interaction is so seamless, intelligent, or predictive it feels like mind-reading or sorcery. Generous Presentation: Packaging that is an experience in itself, interfaces with delightful 
    micro-interactions, or service delivery with surprising personal touches. In essence, aiming for The ‘Holy Shit’ Factor means designing for astonishment. It's about engineering delight, surprise, and undeniable quality into the very fabric of the user experience, 
  with 
    the explicit, bold intention of provoking that instinctive, genuine, and powerful exclamation of awe. It's a high bar, but clearing it is the hallmark of truly exceptional design.

    </THE_HOLY_SHIT_FACTOR>