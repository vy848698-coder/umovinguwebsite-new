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
  guideFor,
  sectionCommand,
  cleanHelpText,
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

  it("takes \"I don't know\" as Not known, and never as No", () => {
    const withUnknown = opts('Yes', 'No', 'Not known')
    expect(matchOption("I don't know", withUnknown)?.label).toBe('Not known')
    expect(matchOption("I'm not sure", withUnknown)?.label).toBe('Not known')
    expect(matchOption('not known', withUnknown)?.label).toBe('Not known')
    expect(matchOption("I don't know", yesNo)).toBeNull()
  })

  it("takes \"I don't have a mortgage\" as No mortgage, never No", () => {
    const mortgage = opts('Yes', 'No', 'No mortgage')
    expect(matchOption("I don't have a mortgage", mortgage)?.label).toBe('No mortgage')
    expect(matchOption("it's mortgage free", mortgage)?.label).toBe('No mortgage')
    expect(matchOption('no mortgage', mortgage)?.label).toBe('No mortgage')
    expect(matchOption('no', mortgage)?.label).toBe('No')
    expect(matchOption('yes it will', mortgage)?.label).toBe('Yes')
  })

  it('understands Included, Excluded and None in everyday words', () => {
    const ien = opts('Included', 'Excluded', 'None')
    expect(matchOption("I'm taking it with me", ien)?.label).toBe('Excluded')
    expect(matchOption("it's not included", ien)?.label).toBe('Excluded')
    expect(matchOption("it's staying", ien)?.label).toBe('Included')
    expect(matchOption('yes', ien)?.label).toBe('Included')
    expect(matchOption("there isn't one", ien)?.label).toBe('None')
    expect(matchOption("we don't have one", ien)?.label).toBe('None')
    expect(matchOption('excluded', ien)?.label).toBe('Excluded')
  })

  it('takes built in as Fitted', () => {
    const kind = opts('Fitted', 'Freestanding')
    expect(matchOption("it's built in", kind)?.label).toBe('Fitted')
    expect(matchOption('free standing', kind)?.label).toBe('Freestanding')
  })

  it("takes \"it doesn't apply\" as Not applicable", () => {
    const withNa = opts('Yes', 'No', 'Not applicable')
    expect(matchOption("it doesn't apply", withNa)?.label).toBe('Not applicable')
    expect(matchOption('not applicable', withNa)?.label).toBe('Not applicable')
    expect(matchOption('no', withNa)?.label).toBe('No')
  })
})

// Questions as the API sends them: a plain question, or a multipart one
// whose first part holds the question
const plain = (question: string, description = '') => ({ question, description, type: 'radio' })
const firstPart = (title: string, description = '') => ({ question: '', type: 'multipart', parts: [{ title, description }] })

describe('guideFor, Rights, Parking, Other Charges and Occupiers', () => {
  it.each([
    [firstPart('Does ownership of the property carry a responsibility to contribute towards the cost of any jointly used services, such as maintenance of a private road, a shared driveway, a boundary or drain?'), 'pay towards the upkeep of anything you share'],
    [firstPart('Have you been asked to contribute towards the cost of the jointly used facilities?'), 'has anyone asked you to pay'],
    [firstPart('Have you asked the owner of any other properties to contribute towards the cost of the jointly used facilities?'), 'have you asked a neighbour to pay'],
    [firstPart('Do you exercise any rights or arrangements over any other properties?'), "use a neighbour's land"],
    [firstPart('Do the owners of any other properties exercise any rights or arrangements over the property?'), 'does anyone else use part of your land'],
    [firstPart('Are you aware of any disagreement or complaint about any such right or arrangement?'), 'disagreement or complaint about the rights'],
    // Older passports keep the right in the description
    [plain('Does the seller know if any of the following rights benefit the property:', 'Rights of light'), 'right to light'],
    [plain('Does the seller know if the property benefits from any rights of light?'), 'right to light'],
    [plain('Does the seller know if the property benefits from any rights of support from adjoining properties?'), 'right of support'],
    [plain('Does the seller know if the property benefits from any customary rights (e.g. rights deriving from local traditions)?'), 'Customary rights'],
    [firstPart('Does the seller know if any of the following arrangements affect the property:', "Other people's rights to mines and minerals under the land."), 'minerals'],
    [firstPart('Does the seller know if the property is affected by chancel repair liability?'), 'Chancel repair'],
    [firstPart("Does the seller know if the property is affected by other people's rights to take things from the land (such as timber, hay or fish)?"), 'timber, hay or fish'],
    [firstPart('Are you aware of any drains, pipes or wires serving the property that cross any other property?'), "serve your home run under or over a neighbour's land"],
    [firstPart('Are you aware of any drains, pipes or wires leading to any other property that cross the property?'), "serve a neighbour's home"],
    [plain("Do any drains, pipes or wires leading to any neighbour's property cross the property?"), "serve a neighbour's home"],
    [firstPart('Is there any agreement or arrangement about drains, pipes or wires?'), 'agreement, written or not'],
    [plain('What are the parking arrangements at the property?'), 'how parking works'],
    [plain('Is the property in a controlled parking zone or within a local authority parking scheme?'), 'council control parking'],
    [firstPart('Does the seller have to pay any charges relating to the property (excluding any payments such as council tax, utility charges, etc.), for example payments to a management company?'), 'regular charges'],
    [plain('Does the seller live at the property?'), 'live in the home now'],
    [firstPart('Does anyone else, aged 17 or over, live at the property??'), 'any other adult'],
    [plain('Are any of the occupiers (other than the sellers), aged 17 or over, tenants or lodgers?'), 'tenant or a lodger'],
    [plain('Is the property being sold with vacant possession?', 'If Yes, have all the occupiers aged 17 or over:'), 'Vacant possession means'],
    // Older passports ask TA6 13.6 under the vacant possession title
    [firstPart('Is the property being sold with vacant possession?', 'Agreed to sign the sale contract? Please answer Yes or No.'), 'agreed to sign the sale contract'],
    [firstPart('Have all occupiers aged 17 or over agreed to sign the sale contract and to complete?'), 'agreed to sign the sale contract'],
    [plain('If the property is not being sold with vacant possession, provide details of their tenancy agreements.'), 'tenancy agreements'],
  ])('%#: guidance that fits the question', (q, words) => {
    expect(guideFor(q, q.type).say).toContain(words)
  })
})

describe('guideFor, Services and Transaction Information', () => {
  it.each([
    [firstPart('Has the whole or any part of the electrical installation been tested by a qualified and registered electrician?'), 'tested the wiring'],
    [firstPart('Has the property been rewired or had any electrical installation work carried out since 1 January 2005?'), 'rewired'],
    [plain('How is the property heated? Tick all that apply:'), 'Tick every way your home is heated'],
    [plain('What type of system is it (e.g. mains gas, liquid gas, oil, electricity, etc.)?'), 'Tick every way your home is heated'],
    [plain('Does the property have a central heating system?'), 'one central system'],
    [firstPart('When was the heating system installed?'), 'put in'],
    [plain('Is the heating system in good working order?'), 'work properly right now'],
    [firstPart('In what year was the heating system last serviced/maintained?'), 'last serviced'],
    [plain('Has there been any replacement to the heating system (other than replacement of a boiler)?'), 'apart from a new boiler'],
    [plain('Supply compliance certificates or documentation for the installation or alteration of each heating system (such as a building regulation completion certificate).'), 'certificates for fitting or changing the heating'],
    [plain('If there is more than one heating system, attach answers to the above questions separately for each one.'), 'two or more separate heating systems'],
    [plain('Is the property connected to mains foul water drainage?'), 'Foul water'],
    // Older passports keep the real question in the description
    [plain('Is the property connected to mains:', 'A foul water drainage?'), 'Foul water'],
    [plain('Is the property connected to mains surface water drainage?'), 'Surface water'],
    [firstPart('Is sewerage for the property provided by a septic tank?'), 'A septic tank is'],
    [firstPart('Is sewerage for the property provided by:', 'A septic tank?'), 'A septic tank is'],
    [plain('Is sewerage for any part of the property provided by a sewage treatment plant?'), 'A sewage treatment plant is'],
    [plain('Is sewerage for any part of the  property provided by:', 'A sewage treatment plant?'), 'A sewage treatment plant is'],
    [plain('Is sewerage for any part of the property provided by a cesspool?'), 'A cesspool is'],
    [firstPart('Is the use of the septic tank, sewage treatment plant or cesspool shared with other properties?'), 'any other home use the same'],
    [plain('When was the system last emptied?'), 'last emptied'],
    [plain('If the property is served by a sewage treatment plant, when was the treatment plant last serviced?'), 'last serviced'],
    [plain('When was the system installed?'), 'was put in'],
    [firstPart('Is any part of the septic tank, sewage treatment plant (including any soakaway or outfall) or cesspool, or the access to it, outside the boundary of the property?'), "on someone else's land"],
    [firstPart('Mains electricity - is this service/utility connected to the property?'), 'mains electricity'],
    [firstPart('Mains gas - is this service/utility connected to the property?'), 'mains gas'],
    [firstPart('Mains water - is this service/utility connected to the property?'), 'mains water'],
    [firstPart('Mains sewage - is this service/utility connected to the property?'), 'mains sewer'],
    [firstPart('Telephone - is this service/utility connected to the property?'), 'phone line'],
    [firstPart('Broadband  - is this service/utility connected to the property?'), 'broadband'],
    [firstPart('Small sewage treatment plant - is this service/utility connected to the property?'), 'small sewage treatment plant'],
    [firstPart('Shared ground / air source heat pumps - is this service/utility connected to the property?'), 'shared with other homes'],
    [firstPart('Is this sale dependent on the seller completing the purchase of another property on the same day?'), 'buying another home'],
    [firstPart('Does the seller have any special requirements about a moving date?'), 'particular date'],
    [plain('Will the sale price be sufficient to repay all mortgages and charges secured on the property?'), 'No mortgage'],
    [plain('Will the seller ensure that all rubbish is removed from the property (including from the loft, garden, outbuildings, garages and sheds) and that the property will be left in a clean and tidy condition?'), 'clear everything out'],
    [plain('Will the seller ensure that:', 'All rubbish is removed from the property (including from the loft, garden, outbuildings, garages and sheds) and that the property will be left in a clean and tidy condition?'), 'clear everything out'],
    [plain('Will the seller ensure that, if light fittings are removed, the fittings will be replaced with a ceiling rose, flex, bulb holder and bulb?'), 'ceiling rose'],
    [plain('Will the seller ensure that reasonable care will be taken when removing any other fittings or contents?'), 'take care not to damage'],
    [plain('Will the seller ensure that keys to all windows and doors and details of alarm codes will be left at the property or with the estate agent?'), 'alarm code'],
  ])('%#: guidance that fits the question', (q, words) => {
    expect(guideFor(q, q.type).say).toContain(words)
  })
})

// A Fixtures item as the API sends it: the item, its price box and a note
const IEN = [{ label: 'Included' }, { label: 'Excluded' }, { label: 'None' }]
const item = (title: string, description = '', fitted = false) => ({
  question: '',
  type: 'multipart',
  parts: [
    { title, description, type: 'RADIO', options: IEN },
    ...(fitted ? [{ title: 'Installation Type', type: 'RADIO', options: [{ label: 'Fitted' }, { label: 'Freestanding' }] }] : []),
    { title: 'Enter your asking price for this item', type: 'date', options: [{ label: 'Enter Selling Price' }] },
    { title: '', type: 'text' },
  ],
})
const otherItem = (title: string, description: string) => ({
  question: title,
  description,
  type: 'multipart',
  parts: [
    { title: 'Item Name', type: 'text' },
    { title: 'Item Description', type: 'text' },
    { title: 'Inclusion Status', type: 'radio', options: IEN },
    { title: 'Enter your asking price for this item', type: 'date', options: [{ label: 'Enter Selling Price' }] },
  ],
})

describe('guideFor, Fixtures and Fittings', () => {
  it.each([
    [item('Boiler/Immersion Heater', 'Specify heating equipment and hot water systems included in the sale.'), 'Will the boiler or immersion heater stay'],
    [item('Radiators/Wall Heaters'), "aren't any"],
    [item('Burglar Alarm'), "isn't one"],
    [item('Roof Insulation'), "isn't any"],
    [item('Hob', 'Cooktop surface for cooking', true), 'fitted or freestanding'],
    [item('Washing Machine', '', true), 'Will the washing machine stay'],
    [item('Bath'), 'Will the bath stay'],
    [item('Rotary Line'), 'rotary washing line'],
    [item('Oil', 'Heating oil reserves in tanks for oil-fired heating systems'), 'heating oil'],
    // The same room in four lists, told apart by the description
    [item('Living Room', 'Floor coverings and carpets in the main living and reception areas'), 'carpets and floor coverings in the living room'],
    [item('Living Room', 'Hardwaresystems for hanging curtains and window treatments in the main living area'), 'curtain rails'],
    [item('Bedroom 1', 'Light fixtures and electrical fittings in the main bedroom'), 'light fittings in bedroom 1'],
    [item('Hall, Stairs and Landing', 'Built-in storage and cupboards in entrance areas and stairways'), 'fitted cupboards'],
    [item('Kitchen', 'Built-in kitchen cabinets, cupboards, and storage systems'), 'fitted cupboards, shelves and wardrobes in the kitchen'],
    [{ question: 'Bedroom 2', description: 'Window treatments and coverings in the second bedroom', type: 'radio', options: [{ label: 'Yes' }, { label: 'No' }] }, 'curtains and blinds in bedroom 2'],
    [otherItem('Other Kitchen Items', 'Additional kitchen appliances, fixtures, or equipment not listed in previous sections'), 'anything else in the kitchen'],
    [otherItem('Other Rooms', 'Window treatments and coverings in additional rooms not listed in previous sections'), 'windows in other rooms'],
    [otherItem('Other Items', 'Any additional fixtures, fittings, or contents not covered in previous sections'), 'anywhere in the home'],
  ])('%#: guidance that fits the item', (q, words) => {
    expect(guideFor(q, q.type).say).toContain(words)
  })

  it('never reads the item price box as the house asking price', () => {
    expect(guideFor(item('Light Switches'), 'multipart').say).not.toContain('three hundred')
  })
})

describe('sectionCommand', () => {
  it.each([
    ['go to rights', 'rightsAndInformalArrangements'],
    ["let's do informal arrangements", 'rightsAndInformalArrangements'],
    ['go to parking', 'parking'],
    ['open other charges', 'otherCharges'],
    ['switch to occupiers', 'occupiers'],
    ['go to services', 'services'],
    ['open the utilities section', 'services'],
    ["let's do transaction information", 'transactionInformation'],
    ['go to fixtures and fittings', 'fixturesAndFittings'],
    ['open fittings', 'fixturesAndFittings'],
    ['go to boundaries', 'boundaries'],
  ])('"%s" opens %s', (said, key) => {
    expect(sectionCommand(said)).toBe(key)
  })

  it('needs a verb, so an answer that names a section is still an answer', () => {
    expect(sectionCommand('parking')).toBeNull()
  })
})

describe('cleanHelpText', () => {
  const stray = 'Other warranties might include appliance guarantees, garden landscaping, driveway sealing.'
  it('drops the warranties help copied onto other questions', () => {
    expect(cleanHelpText(stray, 'Is the property being sold with vacant possession?')).toBe('')
  })
  it('keeps it on a warranties question', () => {
    expect(cleanHelpText(stray, 'Are there any other guarantees or warranties?')).toBe(stray)
  })
  it('drops the kitchen help copied onto Other Bathroom Items', () => {
    const kitchen = 'Include any specialty kitchen equipment like wine coolers ice makers coffee machines'
    expect(cleanHelpText(kitchen, 'Other Bathroom Items Additional bathroom items not listed in previous sections')).toBe('')
    expect(cleanHelpText(kitchen, 'Other Kitchen Items Additional kitchen appliances')).toBe(kitchen)
  })
  it('cuts content-team notes', () => {
    expect(cleanHelpText('Tells buyers about parking. - please remove text answer yes or no')).toBe('Tells buyers about parking.')
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
