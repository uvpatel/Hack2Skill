import ComapanionsList from '@/components/ComapanionsList'
import CompanionCard from '@/components/CompanionCard'
import CTA from '@/components/CTA'
import { recentSessions } from '@/constants'

const Page = () => {
  return (
    <main>
      <h1>Popular Companions</h1>

      <section className='home-section'>
        <CompanionCard 
          id="123"
          name="Neura the Brainy Explorer"
          topic="Neural Network of the Brain"
          subject="science"
          duration={45}
          color="#ffda6e"
        />
        <CompanionCard 
          id="456"
          name="Countsy the Number Wizard"
          topic="Derivatives and Integrals"
          subject="Maths"
          duration={30}
          color="#e5doff"
        />
        <CompanionCard 
          id="786"
          name="Verba the Vocubalary Builder"
          topic="Language"
          subject="English"
          duration={30}
          color="#BDE7FF"
        />
        
      </section>

      <section className='home-section'>
        <ComapanionsList 
        title="Recently completed sessions"
        companions={recentSessions}
        classNames="w-2/3 max-lg:w-full"
        />
        <CTA /> 
      </section>
    </main>
  )
}

export default Page