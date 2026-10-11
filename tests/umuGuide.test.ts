// How UMU turns what a seller says into answers. Each case is something a
// seller might really say to the assistant.

import { describe, it, expect } from 'vitest'
import {
  voiceCommand,
  matchOption,
  spokenNumber,
  spokenDate,
  spokenEmail,
  spokenPhone,
  spokenPostcode,
  spokenAddress,
  spokenCode,
  spokenLetter,
} from '../utils/umuGuide'

const opts = (...labels: string[]) => labels.map((label) => ({ label }))

describe('voiceCommand', () => {
  it.each([
    ['go back', 'back'],
    ['previous question', 'back'],
    ['skip question', 'skipQuestion'],
    ['come back to this later', 'skipQuestion'],
    ['skip', 'skip'],
    ["I'm not sure", 'skip'],
    ['say that again', 'repeat'],
    ['pardon', 'repeat'],
    ['stop listening', 'stop'],
    ['save', 'save'],
    ['okay save', 'save'],
    ["I've read this", 'save'],
  ])('"%s" is %s', (said, cmd) => {
    expect(voiceCommand(said)).toBe(cmd)
  })

  it('leaves real answers alone, even with command words in them', () => {
    expect(voiceCommand('we saved up for a new kitchen extension last year')).toBeNull()
    expect(voiceCommand('next door owns the fence')).toBeNull()
    expect(voiceCommand('freehold')).toBeNull()
  })
})

describe('matchOption', () => {
  const homes = opts('Detached', 'Semi-Detached', 'Terraced', 'Flat', 'Maisonette', 'Bungalow', 'Dormer Bungalow')
  const tenure = opts('Freehold', 'Leasehold', 'Share of Freehold', 'Commonhold')
  const yesNo = opts('Yes', 'No')

  it('matches the label said word for word', () => {
    expect(matchOption('flat', homes)?.label).toBe('Flat')
    expect(matchOption('it is a semi detached house', homes)?.label).toBe('Semi-Detached')
  })

  it('prefers the longer label when all its words were said', () => {
    expect(matchOption('dormer bungalow', homes)?.label).toBe('Dormer Bungalow')
    expect(matchOption('a share of the freehold', tenure)?.label).toBe('Share of Freehold')
  })

  it('copes with spacing slips from the recogniser', () => {
    expect(matchOption('free hold', tenure)?.label).toBe('Freehold')
  })

  it('matches by position', () => {
    expect(matchOption('the second one', tenure)?.label).toBe('Leasehold')
    expect(matchOption('option 3', tenure)?.label).toBe('Share of Freehold')
    expect(matchOption('the last one', tenure)?.label).toBe('Commonhold')
  })

  it('understands everyday yes and no', () => {
    expect(matchOption('yeah', yesNo)?.label).toBe('Yes')
    expect(matchOption("that's right", yesNo)?.label).toBe('Yes')
    expect(matchOption('nope', yesNo)?.label).toBe('No')
    expect(matchOption("I'm not", yesNo)?.label).toBe('No')
  })

  it('falls back to another reading of the answer', () => {
    expect(matchOption(['blat', 'flat'], homes)?.label).toBe('Flat')
  })

  it('returns null when nothing fits', () => {
    expect(matchOption('a houseboat on the canal', tenure)).toBeNull()
  })
})

describe('spokenNumber', () => {
  it.each([
    ['350,000', 350000],
    ['£350k', 350000],
    ['two million', 2000000],
    ['three hundred and fifty thousand pounds', 350000],
    ['six', 6],
    ['about 7 I think', 7],
    ['twenty five percent', 25],
  ])('"%s" is %d', (said, n) => {
    expect(spokenNumber(said)).toBe(n)
  })

  it('is null when no number was said', () => {
    expect(spokenNumber('quite loud really')).toBeNull()
  })
})

describe('spokenDate', () => {
  it.each([
    ['31 March 2125', '2125-03-31'],
    ['March 31st 2125', '2125-03-31'],
    ['31/03/2125', '2125-03-31'],
    ['june 2019', '2019-06-01'],
  ])('"%s" is %s', (said, iso) => {
    expect(spokenDate(said)).toBe(iso)
  })

  it('is null without a year', () => {
    expect(spokenDate('next march')).toBeNull()
  })
})

describe('spoken contact details', () => {
  it('builds an email address', () => {
    expect(spokenEmail('john dot smith at example dot com')).toBe('john.smith@example.com')
    expect(spokenEmail('jane underscore doe at mail dot co dot uk')).toBe('jane_doe@mail.co.uk')
  })

  it('builds a phone number', () => {
    expect(spokenPhone('oh seven seven double one two three four five six seven')).toBe('07711234567')
  })

  it('builds a postcode', () => {
    expect(spokenPostcode('c v six six e x')).toBe('CV6 6EX')
    expect(spokenPostcode('SW1A 1AA')).toBe('SW1A 1AA')
  })

  it('finds a spoken postcode at the end of an address', () => {
    expect(spokenAddress('12 High Street Coventry c v six six e x')).toBe('12 High Street Coventry CV6 6EX')
  })

  it('joins a spelled reference and leaves words alone', () => {
    expect(spokenCode('a b one two three')).toBe('AB123')
    expect(spokenCode('Smith and Co')).toBe('Smith and Co')
  })
})

describe('spokenLetter', () => {
  it.each([
    ['band C', 'C'],
    ["it's band see", 'C'],
    ['B', 'B'],
    ['band d', 'D'],
  ])('"%s" is %s', (said, letter) => {
    expect(spokenLetter(said)).toBe(letter)
  })

  it('is null for a letter past the council tax bands', () => {
    expect(spokenLetter('band Z')).toBeNull()
  })
})
