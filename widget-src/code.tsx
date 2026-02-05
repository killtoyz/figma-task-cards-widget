const { widget } = figma
const { AutoLayout, Text, Input, Rectangle, useSyncedState, usePropertyMenu } = widget

type CardStatus = 'To Do' | 'In Progress' | 'In Renew' | 'Done'

interface Card {
  id: string
  status: CardStatus
  title: string
  description: string
  date: string
  details: string
}

interface Settings {
  showPlaceholder: boolean
  showDescription: boolean
  showStatus: boolean
  showDate: boolean
  showDetails: boolean
}

const STATUS_CONFIG: Record<CardStatus, { color: string; nextStatus: CardStatus }> = {
  'To Do': { color: '#FCCC88', nextStatus: 'In Progress' },
  'In Progress': { color: '#8CD0FD', nextStatus: 'In Renew' },
  'In Renew': { color: '#BDB0FF', nextStatus: 'Done' },
  'Done': { color: '#8DE2BE', nextStatus: 'To Do' }
}

function Widget() {
  const [cards, setCards] = useSyncedState<Card[]>('cards', [
    {
      id: '1',
      status: 'To Do',
      title: 'Title',
      description: 'Task short description or link',
      date: 'Jan 1, 2026',
      details: 'Details'
    }
  ])

  const [settings, setSettings] = useSyncedState<Settings>('settings', {
    showPlaceholder: true,
    showDescription: true,
    showStatus: true,
    showDate: true,
    showDetails: true
  })

  // Menu (buttons and toggles)
  usePropertyMenu(
    [
      {
        itemType: 'toggle',
        propertyName: 'showPlaceholder',
        tooltip: 'Show placeholder',
        isToggled: settings.showPlaceholder,
      },
      {
        itemType: 'toggle',
        propertyName: 'showDescription',
        tooltip: 'Show description',
        isToggled: settings.showDescription,
      },
      {
        itemType: 'toggle',
        propertyName: 'showStatus',
        tooltip: 'Show status',
        isToggled: settings.showStatus,
      },
      {
        itemType: 'toggle',
        propertyName: 'showDate',
        tooltip: 'Show date',
        isToggled: settings.showDate,
      },
      {
        itemType: 'toggle',
        propertyName: 'showDetails',
        tooltip: 'Show details',
        isToggled: settings.showDetails,
      },
      {
        itemType: 'separator',
      },
      {
        itemType: 'action',
        propertyName: 'addCard',
        tooltip: 'Add card',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>`,
      },
      {
        itemType: 'action',
        propertyName: 'removeCard',
        tooltip: 'Remove card',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>`,
      },
    ],
    ({ propertyName }) => {
      if (propertyName === 'showPlaceholder') {
        setSettings({ ...settings, showPlaceholder: !settings.showPlaceholder })
      } else if (propertyName === 'showDescription') {
        setSettings({ ...settings, showDescription: !settings.showDescription })
      } else if (propertyName === 'showStatus') {
        setSettings({ ...settings, showStatus: !settings.showStatus })
      } else if (propertyName === 'showDate') {
        setSettings({ ...settings, showDate: !settings.showDate })
      } else if (propertyName === 'showDetails') {
        setSettings({ ...settings, showDetails: !settings.showDetails })
      } else if (propertyName === 'addCard') {
        addCard()
      } else if (propertyName === 'removeCard') {
        removeCard()
      }
    }
  )

  const toggleStatus = (cardId: string) => {
    setCards(cards.map(card => {
      if (card.id === cardId) {
        return { ...card, status: STATUS_CONFIG[card.status].nextStatus }
      }
      return card
    }))
  }

  const updateTitle = (cardId: string, newTitle: string) => {
    setCards(cards.map(card => 
      card.id === cardId ? { ...card, title: newTitle } : card
    ))
  }

  const updateDescription = (cardId: string, newDescription: string) => {
    setCards(cards.map(card => 
      card.id === cardId ? { ...card, description: newDescription } : card
    ))
  }

  const updateDate = (cardId: string, newDate: string) => {
    setCards(cards.map(card => 
      card.id === cardId ? { ...card, date: newDate } : card
    ))
  }

  const updateDetails = (cardId: string, newDetails: string) => {
    setCards(cards.map(card => 
      card.id === cardId ? { ...card, details: newDetails } : card
    ))
  }

  const addCard = () => {
    const newCard: Card = {
      id: Date.now().toString(),
      status: 'To Do',
      title: 'Title',
      description: 'Description',
      date: 'Jan 1, 2026',
      details: 'Details'
    }
    setCards([...cards, newCard])
  }

  const removeCard = () => {
    if (cards.length > 1) {
      setCards(cards.slice(0, -1))
    }
  }

  return (
    <AutoLayout
      direction="horizontal"
      spacing={20}
      padding={0}
    >
      {/* Cards */}
      {cards.map((card) => (
        <AutoLayout
          key={card.id}
          direction="vertical"
          spacing={20}
          padding={40}
          width={825}
          height={325}
          fill="#FFFFFF"
          cornerRadius={12}
          stroke="#E6E6E6"
          strokeWidth={2}
        >
          {/* Status & Details */}
          <AutoLayout
            direction="horizontal"
            width="fill-parent"
            spacing={10}
          >
            {/* Status */}
            {settings.showStatus && (
              <AutoLayout
                fill={STATUS_CONFIG[card.status].color}
                cornerRadius={8}
                padding={{ vertical: 8, horizontal: 16 }}
                onClick={() => toggleStatus(card.id)}
              >
                <Text
                  fontSize={20}
                  fontWeight={500}
                  fontFamily="Inter"
                  fill="#464453"
                >
                  {card.status}
                </Text>
              </AutoLayout>
            )}

            {/* Details*/}
            <AutoLayout
              direction="horizontal"
              width="fill-parent"
              horizontalAlignItems="end"
            >
              {settings.showDetails && (
                <Input
                  value={card.details}
                  placeholder="Details"
                  horizontalAlignText={'right'}
                  onTextEditEnd={(e) => updateDetails(card.id, e.characters)}
                  fontSize={16}
                  fontFamily="Inter"
                  fill="#333333"
                  width={200}
                  inputBehavior="wrap"
                />
              )}
            </AutoLayout>
          </AutoLayout>

          {/* Placeholder for icon, illustration or img or smth... */}
          {settings.showPlaceholder && (
            <Rectangle
              width={60}
              height={60}
              fill="#E0E0E0"
              cornerRadius={8}
            />
          )}

          {/* Title */}
          <Input
            value={card.title}
            placeholder="Title"
            onTextEditEnd={(e) => updateTitle(card.id, e.characters)}
            fontSize={45}
            fontWeight={600}
            fontFamily="Inter"
            fill="#333333"
            width="fill-parent"
            inputBehavior="wrap"
          />

          {/* Task link or description & Date */}
          <AutoLayout
            direction="horizontal"
            width="fill-parent"
            spacing={10}
          >
            {/* Task link or short description */}
            {settings.showDescription && (
              <Input
                value={card.description}
                placeholder="Short description"
                onTextEditEnd={(e) => updateDescription(card.id, e.characters)}
                fontSize={20}
                fontWeight={400}
                fontFamily="Inter"
                fill="#333333"
                width={settings.showDate ? 550 : "fill-parent"}
                inputBehavior="multiline"
              />
            )}

            {/* Date */}
            <AutoLayout
            direction="horizontal"
            width="fill-parent"
            horizontalAlignItems="end"
            >
            {settings.showDate && (
              <Input
                value={card.date}
                placeholder="Date"
                horizontalAlignText={'right'}
                onTextEditEnd={(e) => updateDate(card.id, e.characters)}
                fontSize={16}
                fontFamily="Inter"
                fill="#333333"
                width={settings.showDescription ? 100 : "fill-parent"}
                inputBehavior="wrap"
              />
            )}
            </AutoLayout>
          </AutoLayout>
        </AutoLayout>
      ))}
    </AutoLayout>
  )
}

widget.register(Widget)
