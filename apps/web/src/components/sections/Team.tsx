import React from 'react'
import type { Team as TeamMember } from '@/payload-types'
import { mediaURL, mediaAlt } from '@/lib/media'

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

export function Team({ team }: { team: TeamMember[] }) {
  if (team.length === 0) return null
  return (
    <section className="section" id="team">
      <div className="container">
        <header className="section__head">
          <p className="section__eyebrow">The people</p>
          <h2 className="section__title">Meet the Team</h2>
        </header>
        <div className="grid grid--3">
          {team.map((member) => {
            const photo = mediaURL(member.photo)
            return (
              <article key={member.id} className="card team-card">
                <div className="team-card__avatar">
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo} alt={mediaAlt(member.photo, member.name)} width={96} height={96} />
                  ) : (
                    <span className="team-card__monogram" aria-hidden="true">
                      {initials(member.name)}
                    </span>
                  )}
                </div>
                <h3 className="card__title">{member.name}</h3>
                {member.role ? <p className="team-card__role">{member.role}</p> : null}
                {member.bio ? <p className="card__text">{member.bio}</p> : null}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
