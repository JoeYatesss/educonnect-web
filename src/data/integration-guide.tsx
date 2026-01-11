import { ReactNode } from 'react';

export interface Subsection {
  id: string;
  title: string;
  content: ReactNode;
}

export interface GuideSection {
  id: string;
  title: string;
  emoji: string;
  subsections: Subsection[];
}

export const guideSections: GuideSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    emoji: '🚀',
    subsections: [
      {
        id: 'first-week',
        title: 'Your First Week',
        content: (
          <>
            <p>Welcome to China! Your first week will be busy but exciting. Here's what to prioritize in your first 7 days.</p>
          </>
        ),
      },
      {
        id: 'vpn',
        title: 'VPN & Internet Setup (Critical!)',
        content: (
          <>
            <p>Installing a VPN before arriving in China is <strong>absolutely critical</strong>. Many websites and apps you rely on daily (Google, Gmail, Facebook, Instagram, WhatsApp, etc.) are blocked by the Great Firewall.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Best VPN Services for China</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>ExpressVPN</strong> - Most reliable, works consistently even during sensitive periods. Premium price ($12.95/month).</li>
              <li><strong>Astrill</strong> - Popular among expats, good customer support. ($15-20/month)</li>
              <li><strong>NordVPN</strong> - Budget-friendly option, occasional blocks during major events. ($3-12/month)</li>
            </ul>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
              <p className="font-semibold text-red-900">⚠️ Important: Download and install your VPN BEFORE entering China!</p>
              <p className="text-sm text-red-800 mt-2">VPN websites are blocked in China, making it nearly impossible to set up once you arrive.</p>
            </div>
          </>
        ),
      },
      {
        id: 'essential-apps',
        title: 'Essential Apps to Download First',
        content: (
          <>
            <p>These are the must-have apps for daily life in China. Download them as soon as possible:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-lg">WeChat (微信)</h4>
                <p className="text-sm text-gray-600 mb-2">The everything app - messaging, payments, social media</p>
                <p className="text-sm">You'll use this for communication, payments, ordering food, calling taxis, and more. It's essentially mandatory for life in China.</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-lg">Alipay (支付宝)</h4>
                <p className="text-sm text-gray-600 mb-2">Mobile payment platform</p>
                <p className="text-sm">Primary payment app alongside WeChat Pay. Widely accepted everywhere from street vendors to luxury stores.</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-lg">DiDi (滴滴)</h4>
                <p className="text-sm text-gray-600 mb-2">China's Uber</p>
                <p className="text-sm">The dominant ride-hailing app. Cheaper and more reliable than traditional taxis in most cities.</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-lg">Meituan (美团)</h4>
                <p className="text-sm text-gray-600 mb-2">Food delivery & more</p>
                <p className="text-sm">Order food delivery, book restaurants, find deals on activities, and more.</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-lg">Taobao (淘宝)</h4>
                <p className="text-sm text-gray-600 mb-2">China's Amazon</p>
                <p className="text-sm">Massive online marketplace. You can buy almost anything and have it delivered within days.</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-lg">Pleco</h4>
                <p className="text-sm text-gray-600 mb-2">Chinese dictionary</p>
                <p className="text-sm">Essential translation app with handwriting recognition and camera translator.</p>
              </div>
            </div>
          </>
        ),
      },
      {
        id: 'police-registration',
        title: 'Police Registration (Mandatory)',
        content: (
          <>
            <p>Within <strong>24 hours of arrival</strong>, you must register your address with the local police station. This is a legal requirement.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Required Documents</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Passport with valid visa</li>
              <li>Rental contract or hotel registration</li>
              <li>Landlord's property ownership certificate (if renting)</li>
            </ul>
            <h4 className="text-xl font-semibold mt-6 mb-3">Registration Process</h4>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Find your local police station (ask your landlord or school)</li>
              <li>Bring all required documents</li>
              <li>Fill out the registration form (助警 will help you)</li>
              <li>Receive your registration slip - <strong>keep this safe!</strong></li>
            </ol>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <p className="font-semibold text-blue-900">💡 Pro Tip</p>
              <p className="text-sm text-blue-800 mt-2">If staying in a hotel, they'll handle registration automatically. If renting, your landlord should accompany you for the first registration.</p>
            </div>
          </>
        ),
      },
    ],
  },
  {
    id: 'finance',
    title: 'Finance & Banking',
    emoji: '💰',
    subsections: [
      {
        id: 'banking',
        title: 'Opening a Bank Account',
        content: (
          <>
            <p>Opening a Chinese bank account is essential for receiving your salary and accessing mobile payment apps.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Best Banks for Expats</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Bank of China (<em>中国</em>银行)</strong> - Most expat-friendly, English-speaking staff in major cities</li>
              <li><strong>ICBC (工商银行)</strong> - Largest bank, branches everywhere</li>
              <li><strong>China Construction Bank (建设银行)</strong> - Good for salary accounts</li>
            </ul>
            <h4 className="text-xl font-semibold mt-6 mb-3">Required Documents</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Passport with valid work visa/residence permit</li>
              <li>Police registration slip</li>
              <li>Chinese phone number</li>
              <li>Employment contract (sometimes required)</li>
              <li>Initial deposit (usually ¥100-500)</li>
            </ul>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
              <p className="font-semibold text-yellow-900">⚠️ Important</p>
              <p className="text-sm text-yellow-800 mt-2">You cannot open a bank account on a tourist visa. Wait until you have your work permit or residence permit.</p>
            </div>
          </>
        ),
      },
      {
        id: 'mobile-payments',
        title: 'WeChat Pay & Alipay Setup',
        content: (
          <>
            <p>China is essentially cashless. You'll need WeChat Pay or Alipay for almost everything - from buying groceries to paying utility bills.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Setting Up WeChat Pay</h4>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Download WeChat and create an account</li>
              <li>Open a Chinese bank account</li>
              <li>Go to "Me" → "Wallet" → "Cards"</li>
              <li>Add your Chinese debit card</li>
              <li>Complete identity verification with your passport</li>
            </ol>
            <h4 className="text-xl font-semibold mt-6 mb-3">Setting Up Alipay</h4>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Download Alipay app</li>
              <li>Register with your Chinese phone number</li>
              <li>Link your Chinese bank card</li>
              <li>Complete identity verification</li>
            </ol>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4">
              <p className="font-semibold text-green-900">✅ Pro Tip</p>
              <p className="text-sm text-green-800 mt-2">Both WeChat Pay and Alipay now support foreign credit cards for tourists, but the experience is limited. A Chinese bank account gives you full functionality.</p>
            </div>
          </>
        ),
      },
      {
        id: 'money-transfers',
        title: 'International Money Transfers',
        content: (
          <>
            <p>Sending money home or receiving funds from abroad requires understanding China's currency controls.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Best Transfer Services</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Wise (formerly TransferWise)</strong> - Low fees, good exchange rates</li>
              <li><strong>Western Union</strong> - Fast but higher fees</li>
              <li><strong>Bank wire transfers</strong> - Slowest but most official</li>
            </ul>
            <h4 className="text-xl font-semibold mt-6 mb-3">Currency Control Limits</h4>
            <p>China has strict currency controls:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Individuals can exchange up to $50,000 USD equivalent per year</li>
              <li>Cash withdrawals from ATMs abroad are limited to $10,000 USD per year</li>
              <li>Large transfers require documentation (tax records, salary slips)</li>
            </ul>
          </>
        ),
      },
      {
        id: 'fapiaos',
        title: 'Understanding Fapiaos (发票)',
        content: (
          <>
            <p>Fapiaos are official receipts required for business expenses and tax purposes in China.</p>
            <p className="my-4">When you make purchases for work (supplies, meals, transportation), always ask for a fapiao. These are different from regular receipts and are used for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Expense reimbursement from your school</li>
              <li>Tax deductions</li>
              <li>Proof of purchase for warranty claims</li>
            </ul>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <p className="font-semibold text-blue-900">💡 How to Request</p>
              <p className="text-sm text-blue-800 mt-2">Say "请给我开发票" (qǐng gěi wǒ kāi fāpiào) or show this phrase on your phone. You'll need to provide your company's tax ID number.</p>
            </div>
          </>
        ),
      },
    ],
  },
  {
    id: 'housing',
    title: 'Housing & Utilities',
    emoji: '🏠',
    subsections: [
      {
        id: 'finding-housing',
        title: 'Finding Housing',
        content: (
          <>
            <p>Finding quality housing in China requires patience and due diligence. Most schools provide assistance or housing allowances.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Housing Options</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>School-Provided Housing</strong> - Often included in contract, convenient but less choice</li>
              <li><strong>Housing Allowance</strong> - More flexibility but requires finding your own apartment</li>
              <li><strong>Shared Apartments</strong> - Budget-friendly, good for meeting people</li>
              <li><strong>Expat Compounds</strong> - Premium option with English-speaking management</li>
            </ul>
            <h4 className="text-xl font-semibold mt-6 mb-3">Where to Search</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>SmartShanghai / SmartBeijing</strong> - Expat-focused classifieds (English)</li>
              <li><strong>Ziroom (自如)</strong> - Large rental platform (Chinese app)</li>
              <li><strong>WeChat Groups</strong> - City-specific expat housing groups</li>
              <li><strong>Real Estate Agents</strong> - Usually charge 30-50% of first month's rent as commission</li>
            </ul>
          </>
        ),
      },
      {
        id: 'rental-process',
        title: 'Rental Process & Lease Agreements',
        content: (
          <>
            <p>Understanding Chinese rental contracts and processes protects you from common pitfalls.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Typical Deposit Structure</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Deposit:</strong> Usually 1-2 months' rent (refundable)</li>
              <li><strong>Payment:</strong> 1-3 months' rent paid in advance</li>
              <li><strong>Agent Fee:</strong> If using an agent, 30-50% of one month's rent</li>
            </ul>
            <h4 className="text-xl font-semibold mt-6 mb-3">Contract Checklist</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Verify landlord's property ownership certificate</li>
              <li>Check if utilities are included or separate</li>
              <li>Clarify deposit return conditions</li>
              <li>Understand early termination policies</li>
              <li>Get everything in writing - verbal agreements don't count</li>
            </ul>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
              <p className="font-semibold text-red-900">⚠️ Red Flags</p>
              <ul className="text-sm text-red-800 mt-2 space-y-1">
                <li>• Landlord unable to show property ownership documents</li>
                <li>• Request for cash-only payments without receipts</li>
                <li>• Pressure to sign immediately without time to review</li>
                <li>• Unusually low rent compared to market rates</li>
              </ul>
            </div>
          </>
        ),
      },
    ],
  },
  {
    id: 'daily-living',
    title: 'Daily Living',
    emoji: '🛍️',
    subsections: [
      {
        id: 'shopping',
        title: 'Shopping & Daily Life',
        content: (
          <>
            <p>China offers incredible convenience for daily shopping, from massive malls to quick app-based delivery.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Online Shopping Platforms</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Taobao (淘宝)</strong> - Everything imaginable, budget-friendly, Chinese interface</li>
              <li><strong>JD.com (京东)</strong> - Reliable, fast shipping, better for electronics</li>
              <li><strong>Tmall (天猫)</strong> - Premium/official brand stores, part of Alibaba</li>
              <li><strong>Pinduoduo (拼多多)</strong> - Group-buying discounts, ultra-cheap but quality varies</li>
            </ul>
            <h4 className="text-xl font-semibold mt-6 mb-3">Physical Stores</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Carrefour / Walmart</strong> - Western-style supermarkets</li>
              <li><strong>Ole / City Super</strong> - Upscale imported goods</li>
              <li><strong>Local Markets</strong> - Fresh produce, meat, cheapest prices</li>
              <li><strong>Convenience Stores</strong> - FamilyMart, 7-11, Lawson everywhere</li>
            </ul>
          </>
        ),
      },
      {
        id: 'food',
        title: 'Food & Dining',
        content: (
          <>
            <p>Chinese food culture is diverse and exciting. From street food to Michelin-starred restaurants, there's something for every budget.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Food Delivery Apps</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Meituan (美团)</strong> - Most popular, widest selection</li>
              <li><strong>Ele.me (饿了么)</strong> - Alibaba's delivery platform</li>
            </ul>
            <p className="my-4">Both apps are incredibly cheap and fast - typical delivery costs ¥3-5 ($0.50-0.75) and arrives in 20-40 minutes.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Must-Try Dishes by Region</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Shanghai:</strong> Xiaolongbao (soup dumplings), Shengjianbao (pan-fried buns)</li>
              <li><strong>Beijing:</strong> Peking duck, Jiaozi (dumplings), Zhajiangmian (noodles)</li>
              <li><strong>Sichuan:</strong> Hotpot, Mapo tofu, Dan dan noodles (spicy!)</li>
              <li><strong>Guangdong:</strong> Dim sum, Char siu (BBQ pork), Congee</li>
            </ul>
          </>
        ),
      },
      {
        id: 'transportation',
        title: 'Transportation',
        content: (
          <>
            <p>China's public transportation is world-class, efficient, and incredibly affordable.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Metro Systems</h4>
            <p>Major cities have extensive metro systems. Download the local metro app:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Shanghai:</strong> Metro Daduhui app</li>
              <li><strong>Beijing:</strong> Beijing Subway app</li>
              <li><strong>Shenzhen:</strong> Shenzhen Metro app</li>
            </ul>
            <p className="my-4">Most accept WeChat Pay/Alipay for tickets. Physical cards available for ¥20-30 deposit.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Ride-Hailing Apps</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>DiDi (滴滴)</strong> - Chinese Uber, cheapest option</li>
              <li><strong>Meituan Taxi</strong> - Good alternative with promotions</li>
              <li><strong>Street Taxis</strong> - Meter-based but require Chinese language skills</li>
            </ul>
            <h4 className="text-xl font-semibold mt-6 mb-3">Bike Sharing</h4>
            <p>Convenient for short trips:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Meituan Bikes (美团单车)</strong> - Yellow bikes, ¥1.5 per 30 min</li>
              <li><strong>Hellobike (哈啰单车)</strong> - Blue bikes, slightly cheaper</li>
            </ul>
          </>
        ),
      },
    ],
  },
  {
    id: 'health-safety',
    title: 'Health & Safety',
    emoji: '🏥',
    subsections: [
      {
        id: 'healthcare',
        title: 'Healthcare System',
        content: (
          <>
            <p>China has a two-tiered healthcare system: public hospitals (cheaper but crowded) and international hospitals/clinics (expensive but English-speaking).</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">International Hospitals & Clinics</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Shanghai:</strong> Parkway Health, United Family Hospital</li>
              <li><strong>Beijing:</strong> Beijing United Family Hospital, Oasis International Hospital</li>
              <li><strong>Shenzhen:</strong> Shekou International Hospital, UFH Shenzhen</li>
            </ul>
            <p className="my-4">Expect to pay ¥800-1,500 for a standard consultation at international clinics.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Health Insurance</h4>
            <p>Most schools provide international health insurance. Popular providers:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>BUPA</strong> - Comprehensive coverage, widely accepted</li>
              <li><strong>Cigna</strong> - Good for families</li>
              <li><strong>MSH China</strong> - Local expertise with international standards</li>
            </ul>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <p className="font-semibold text-blue-900">💡 Medicine Tip</p>
              <p className="text-sm text-blue-800 mt-2">Bring a 3-6 month supply of prescription medications. While most medicines are available, specific brands might differ. Carry your prescription and a doctor's note.</p>
            </div>
          </>
        ),
      },
      {
        id: 'fitness',
        title: 'Gyms & Exercise',
        content: (
          <>
            <p>Staying active is crucial for physical and mental health. China offers diverse exercise options from ultra-modern gyms to traditional activities.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Gym Chains & Fitness Centers</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>TERA Wellness (超能体感):</strong> High-end chain with English-speaking trainers</li>
              <li><strong>Will's Gym:</strong> Mid-range with good equipment and group classes</li>
              <li><strong>California Fitness:</strong> International chain in major cities</li>
              <li><strong>Local community gyms:</strong> Budget-friendly but limited English</li>
            </ul>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <p className="font-semibold text-blue-900">💡 Gym Membership Tips</p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-blue-800">
                <li>Never pay the full asking price - always negotiate</li>
                <li>Avoid long-term contracts initially</li>
                <li>Check shower facilities and changing rooms first</li>
                <li>Ask about class schedules in English</li>
              </ul>
            </div>
          </>
        ),
      },
      {
        id: 'mental-health',
        title: 'Mental Health & Support',
        content: (
          <>
            <p>Living abroad can be emotionally challenging. Having mental health resources and strategies is essential for long-term success.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Professional Mental Health Services</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Online counseling:</strong> BetterHelp, Talkspace (via VPN)</li>
              <li><strong>International clinics:</strong> Many offer counseling in English</li>
              <li><strong>Shanghai Mental Health Center:</strong> Has international department</li>
              <li><strong>Beijing United Family:</strong> Psychology and counseling services</li>
            </ul>
            <h4 className="text-xl font-semibold mt-6 mb-3">Managing Culture Shock & Homesickness</h4>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Acknowledge it's normal:</strong> Culture shock hits most expats around month 3-6</li>
              <li><strong>Maintain home connections:</strong> Regular video calls with family/friends</li>
              <li><strong>Create new routines:</strong> Find comfort activities in your new environment</li>
              <li><strong>Join support groups:</strong> Expat communities understand your challenges</li>
            </ol>
          </>
        ),
      },
      {
        id: 'emergency-preparedness',
        title: 'Emergency Preparedness & Safety',
        content: (
          <>
            <p>Being prepared for emergencies is crucial when living abroad. Know your resources, have backup plans, and keep important information accessible.</p>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
              <p className="font-semibold text-red-900">⚠️ Save These Numbers Now</p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-red-800">
                <li><strong>Police Emergency:</strong> 110</li>
                <li><strong>Ambulance:</strong> 120</li>
                <li><strong>Fire Emergency:</strong> 119</li>
                <li><strong>Your embassy:</strong> Find and save your country's embassy number</li>
              </ul>
            </div>
            <h4 className="text-xl font-semibold mt-6 mb-3">Natural Disaster Preparedness</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Typhoons:</strong> Southeastern coast (Guangzhou, Shenzhen) - June to October</li>
              <li><strong>Earthquakes:</strong> Western regions (Sichuan, Yunnan)</li>
              <li><strong>Flooding:</strong> Yangtze River basin, southern China during monsoon season</li>
              <li><strong>Air pollution emergencies:</strong> Northern cities during winter months</li>
            </ul>
            <h4 className="text-xl font-semibold mt-6 mb-3">Emergency Preparedness Kit</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Documents:</strong> Passport copies, visa copies, insurance cards</li>
              <li><strong>Cash:</strong> At least ¥2000-5000 in small bills</li>
              <li><strong>Medications:</strong> 1-week supply of essential prescriptions</li>
              <li><strong>Phone chargers:</strong> Portable battery pack</li>
              <li><strong>First aid supplies:</strong> Basic medical supplies</li>
            </ul>
          </>
        ),
      },
    ],
  },
  {
    id: 'legal',
    title: 'Legal & Compliance',
    emoji: '🚨',
    subsections: [
      {
        id: 'work-visa',
        title: 'Work Permits & Visas',
        content: (
          <>
            <p>Your school should handle most of the work permit paperwork, but understanding the process helps ensure everything goes smoothly.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Document Requirements</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Bachelor's degree (notarized and authenticated)</li>
              <li>Teaching certificate (TEFL/TESOL/CELTA)</li>
              <li>Police background check (from home country, less than 6 months old)</li>
              <li>Health check completed in China</li>
              <li>Passport-sized photos (8-12 copies)</li>
              <li>Resume/CV</li>
            </ul>
            <h4 className="text-xl font-semibold mt-6 mb-3">The Process</h4>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>School obtains work permit notification letter</strong> (2-4 weeks)</li>
              <li><strong>Apply for Z visa</strong> at Chinese embassy in your home country (1 week)</li>
              <li><strong>Enter China on Z visa</strong> (valid for 30 days single entry)</li>
              <li><strong>Complete health check</strong> in China (1-2 days)</li>
              <li><strong>Convert to residence permit</strong> (1-2 weeks)</li>
            </ol>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
              <p className="font-semibold text-red-900">⚠️ Critical</p>
              <p className="text-sm text-red-800 mt-2">Never work on a tourist or business visa. Penalties include fines up to ¥20,000, detention, and deportation with a ban on returning to China.</p>
            </div>
          </>
        ),
      },
      {
        id: 'sensitive-topics',
        title: 'Topics to Avoid',
        content: (
          <>
            <p>While you'll generally feel safe and free in your daily life, certain topics should be avoided in public and online.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Sensitive Topics</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Political criticism of the Chinese government</li>
              <li>Tibet, Taiwan, Hong Kong political situations</li>
              <li>Tiananmen Square incident (1989)</li>
              <li>Xinjiang-related political issues</li>
              <li>Comparisons between Chinese and Western political systems</li>
            </ul>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
              <p className="font-semibold text-yellow-900">⚠️ Classroom Guidance</p>
              <p className="text-sm text-yellow-800 mt-2">In your classroom, focus on teaching your subject matter. If students ask political questions, redirect to your school's administration or keep responses neutral and factual.</p>
            </div>
          </>
        ),
      },
    ],
  },
  {
    id: 'social-life',
    title: 'Social Life',
    emoji: '👥',
    subsections: [
      {
        id: 'expat-community',
        title: 'Building Your Network',
        content: (
          <>
            <p>Building a strong social network makes your China experience much more enjoyable and helps with practical matters.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Where to Meet People</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>School Community</strong> - Your colleagues are often your first friends</li>
              <li><strong>Language Exchange Meetups</strong> - Practice Chinese, meet locals</li>
              <li><strong>Sports Leagues</strong> - Ultimate frisbee, soccer, basketball groups in most cities</li>
              <li><strong>Coworking Spaces</strong> - Naked Hub, WeWork for networking</li>
              <li><strong>Expat Bars & Restaurants</strong> - Natural meeting points</li>
            </ul>
            <h4 className="text-xl font-semibold mt-6 mb-3">WeChat Groups to Join</h4>
            <p>WeChat is the primary way expats coordinate in China:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your city's general expat group</li>
              <li>Teachers in [your city] group</li>
              <li>Housing/apartment search groups</li>
              <li>Sports and hobby groups</li>
              <li>Weekend trip planning groups</li>
            </ul>
          </>
        ),
      },
      {
        id: 'cultural-tips',
        title: 'Cultural Etiquette',
        content: (
          <>
            <p>Understanding Chinese cultural norms helps you navigate social situations and build stronger relationships.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Key Cultural Tips</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Gift Giving:</strong> Always bring a small gift when visiting someone's home. Avoid clocks, white flowers, or anything in sets of four (associated with death).</li>
              <li><strong>Business Cards:</strong> Present and receive with both hands, take a moment to read before putting away.</li>
              <li><strong>Meals:</strong> The host typically pays. If you invite, you're expected to pay. Wait for the host to start eating.</li>
              <li><strong>Face (面子):</strong> Never cause someone to lose face by public criticism or contradiction.</li>
              <li><strong>Age & Hierarchy:</strong> Respect for elders and seniority is important. Address people by their title.</li>
            </ul>
            <h4 className="text-xl font-semibold mt-6 mb-3">Dining Etiquette</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Don't stick chopsticks upright in rice (resembles funeral incense)</li>
              <li>Try everything offered, but don't finish everything (implies not enough food)</li>
              <li>Tea pouring: Tap table with two fingers to say thanks</li>
              <li>Toasting: Use both hands when toasting someone senior, touch glasses below theirs</li>
            </ul>
          </>
        ),
      },
    ],
  },
  {
    id: 'family-life',
    title: 'Family Life',
    emoji: '👨‍👩‍👧‍👦',
    subsections: [
      {
        id: 'family-dependents',
        title: 'Bringing Family & Dependents',
        content: (
          <>
            <p>Many teachers bring spouses and children to China. The process requires additional paperwork but is straightforward.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Dependent Visa Process</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Spouses and children can apply for S1 or S2 dependent visas</li>
              <li>Required documents: marriage certificate, birth certificates (notarized and authenticated)</li>
              <li>Dependents cannot work on dependent visas</li>
              <li>Processing time: 2-4 weeks after you receive your work permit</li>
            </ul>
          </>
        ),
      },
      {
        id: 'international-schools',
        title: 'International Schools for Children',
        content: (
          <>
            <p>International schools in China offer high-quality education but can be expensive. Many schools offer tuition waivers or discounts as part of the employment package.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Top International Schools by City</h4>
            <p><strong>Shanghai:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Shanghai American School (SAS)</li>
              <li>Dulwich College Shanghai</li>
              <li>Shanghai Singapore International School</li>
            </ul>
            <p className="mt-4"><strong>Beijing:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>International School of Beijing (ISB)</li>
              <li>Western Academy of Beijing (WAB)</li>
              <li>Dulwich College Beijing</li>
            </ul>
            <p className="my-4">Tuition ranges from ¥150,000 to ¥350,000 per year ($20,000-$50,000). Negotiate tuition benefits during your contract discussions.</p>
          </>
        ),
      },
    ],
  },
  {
    id: 'teaching-success',
    title: 'Teaching Success',
    emoji: '🎓',
    subsections: [
      {
        id: 'teacher-success',
        title: 'Professional Excellence',
        content: (
          <>
            <p>Succeeding as a teacher in China requires understanding the unique educational culture and parent expectations.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Understanding the System</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>High Expectations:</strong> Parents pay premium tuition and expect results</li>
              <li><strong>Communication:</strong> Regular parent updates via WeChat are standard</li>
              <li><strong>Documentation:</strong> Detailed lesson plans and assessments required</li>
              <li><strong>Professional Development:</strong> Ongoing training and workshops common</li>
            </ul>
            <h4 className="text-xl font-semibold mt-6 mb-3">Parent Communication Tips</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Respond promptly to WeChat messages (within 24 hours)</li>
              <li>Share student progress regularly - photos, videos, work samples</li>
              <li>Be diplomatic with concerns - focus on solutions, not problems</li>
              <li>Understand parents are invested in their child's success (often only child)</li>
            </ul>
          </>
        ),
      },
      {
        id: 'career-growth',
        title: 'Career Advancement Opportunities',
        content: (
          <>
            <p>China's international education sector offers excellent career progression opportunities.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Growth Pathways</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Department Head/Coordinator:</strong> 2-3 years experience, +¥50-100k salary increase</li>
              <li><strong>Academic Director:</strong> 5+ years, ¥350-500k+ annual salary</li>
              <li><strong>Principal/Head of School:</strong> 10+ years, ¥600k-1M+ annual salary</li>
              <li><strong>Curriculum Developer:</strong> Specialized role, good for work-life balance</li>
            </ul>
            <h4 className="text-xl font-semibold mt-6 mb-3">Professional Development</h4>
            <p>Invest in your career growth:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Pursue master's degrees (many schools offer tuition support)</li>
              <li>Obtain IB training and certification</li>
              <li>Attend international education conferences (ECIS, CIS)</li>
              <li>Develop leadership skills through committee work</li>
            </ul>
          </>
        ),
      },
    ],
  },
  {
    id: 'city-guides',
    title: 'City Guides',
    emoji: '🏙️',
    subsections: [
      {
        id: 'shanghai',
        title: 'Shanghai (上海) - The International Gateway',
        content: (
          <>
            <p>Shanghai is China's most cosmopolitan city with the largest expat community. It's expensive but offers unparalleled international amenities and career opportunities.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Advantages of Shanghai</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Huge expat community:</strong> Easy to find English-speaking services and friends</li>
              <li><strong>International dining:</strong> Authentic restaurants from every cuisine imaginable</li>
              <li><strong>Career opportunities:</strong> Best city for professional advancement</li>
              <li><strong>Infrastructure:</strong> World-class metro system, clean and efficient</li>
              <li><strong>Cultural scene:</strong> Museums, galleries, concerts, theater</li>
            </ul>
            <h4 className="text-xl font-semibold mt-6 mb-3">Disadvantages</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>High cost of living:</strong> Rent comparable to Western cities</li>
              <li><strong>Competition:</strong> More expats competing for jobs and housing</li>
              <li><strong>Pollution:</strong> Air quality can be poor, especially in winter</li>
              <li><strong>Crowded:</strong> 25+ million people, very busy and stressful</li>
            </ul>
            <h4 className="text-xl font-semibold mt-6 mb-3">Best Areas for Expats</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Jing'an (静安):</strong> Central, excellent transport, high-end shopping</li>
              <li><strong>French Concession (徐汇/黄浦):</strong> Historic charm, tree-lined streets, vibrant nightlife</li>
              <li><strong>Lujiazui (陆家嘴):</strong> Modern financial district in Pudong, newer apartments</li>
            </ul>
          </>
        ),
      },
      {
        id: 'beijing',
        title: 'Beijing (北京) - The Cultural Capital',
        content: (
          <>
            <p>China's capital city offers incredible history, culture, and political significance. It's less international than Shanghai but more authentically Chinese.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Advantages</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Historical significance:</strong> Forbidden City, Great Wall, temples</li>
              <li><strong>Cultural immersion:</strong> More traditional Chinese culture</li>
              <li><strong>Education hub:</strong> Top universities and research institutions</li>
              <li><strong>Four seasons:</strong> Proper winter and autumn (unlike southern cities)</li>
            </ul>
            <h4 className="text-xl font-semibold mt-6 mb-3">Disadvantages</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Air pollution:</strong> Can be severe, especially in winter</li>
              <li><strong>Harsh winters:</strong> Very cold and dry</li>
              <li><strong>Less international:</strong> Fewer Western amenities than Shanghai</li>
            </ul>
          </>
        ),
      },
      {
        id: 'shenzhen',
        title: 'Shenzhen (深圳) - The Tech Hub',
        content: (
          <>
            <p>A young, modern city that transformed from fishing village to tech metropolis in 40 years. Next to Hong Kong with a very entrepreneurial atmosphere.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Advantages</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Modern infrastructure:</strong> Everything is new and well-planned</li>
              <li><strong>Tech ecosystem:</strong> Startups, innovation, entrepreneurial spirit</li>
              <li><strong>Young population:</strong> Average age around 30, very dynamic</li>
              <li><strong>Close to Hong Kong:</strong> Easy weekend trips (with proper visa)</li>
              <li><strong>Lower cost than Shanghai:</strong> More affordable luxury living</li>
            </ul>
            <h4 className="text-xl font-semibold mt-6 mb-3">Best Expat Areas</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Shekou (蛇口):</strong> Traditional expat area with international schools</li>
              <li><strong>Nanshan (南山):</strong> Tech hub with modern amenities</li>
              <li><strong>Futian (福田):</strong> Business center with good transport</li>
            </ul>
          </>
        ),
      },
      {
        id: 'guangzhou',
        title: 'Guangzhou (广州) - The Trading Hub',
        content: (
          <>
            <p>A major trading and business center in southern China, Guangzhou offers excellent career opportunities with a rich Cantonese culture and cuisine.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Why Choose Guangzhou</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Cantonese culture:</strong> Dim sum, Cantonese language</li>
              <li><strong>International trade:</strong> Canton Fair twice yearly</li>
              <li><strong>Diverse expat community:</strong> African, Middle Eastern communities</li>
              <li><strong>Lower cost:</strong> More affordable than Shanghai/Beijing</li>
              <li><strong>Hot climate:</strong> Tropical weather year-round</li>
            </ul>
          </>
        ),
      },
      {
        id: 'chengdu',
        title: 'Chengdu (成都) - The Laid-Back Cultural City',
        content: (
          <>
            <p>Capital of Sichuan province, famous for spicy food, pandas, and relaxed lifestyle. One of China's most livable cities with incredible local culture.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Advantages</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Low cost of living:</strong> Very affordable compared to tier-1 cities</li>
              <li><strong>Incredible food scene:</strong> Spicy Sichuan cuisine, hotpot culture</li>
              <li><strong>Relaxed lifestyle:</strong> Tea house culture, slower pace of life</li>
              <li><strong>Friendly locals:</strong> Known for hospitality and humor</li>
              <li><strong>Growing expat scene:</strong> Tight-knit community</li>
            </ul>
            <h4 className="text-xl font-semibold mt-6 mb-3">Challenges</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Limited English:</strong> Fewer English speakers than tier-1 cities</li>
              <li><strong>Humid climate:</strong> Cloudy, drizzly weather much of the year</li>
              <li><strong>Spicy food:</strong> Can be overwhelming if you don't like spice</li>
            </ul>
          </>
        ),
      },
      {
        id: 'hangzhou',
        title: 'Hangzhou (杭州) - The Digital Capital',
        content: (
          <>
            <p>Home to Alibaba and one of China's most beautiful cities, Hangzhou offers a perfect blend of technology innovation and traditional culture.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Why Choose Hangzhou</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Alibaba headquarters:</strong> Major tech scene</li>
              <li><strong>Beautiful West Lake:</strong> UNESCO World Heritage site</li>
              <li><strong>Tea culture:</strong> Famous for Longjing tea</li>
              <li><strong>1 hour from Shanghai:</strong> Easy access to international city</li>
              <li><strong>Lower cost:</strong> More affordable than Shanghai</li>
            </ul>
          </>
        ),
      },
      {
        id: 'suzhou',
        title: 'Suzhou (苏州) - The Garden City',
        content: (
          <>
            <p>Famous for its classical gardens and modern industrial parks, Suzhou offers traditional Chinese culture with excellent international business opportunities.</p>
            <h4 className="text-xl font-semibold mt-6 mb-3">Why Choose Suzhou</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Classical gardens:</strong> UNESCO World Heritage sites</li>
              <li><strong>Industrial Park:</strong> Many international companies</li>
              <li><strong>Close to Shanghai:</strong> 25 minutes by high-speed rail</li>
              <li><strong>Family-friendly:</strong> Good for expats with children</li>
              <li><strong>Traditional culture:</strong> More authentic Chinese experience</li>
            </ul>
          </>
        ),
      },
    ],
  },
];
