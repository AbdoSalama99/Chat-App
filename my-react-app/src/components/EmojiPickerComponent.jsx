import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
const EmojiPickerComponent = ({
  newTextMsg,
  setNewTextMsg,
  setShowEmoji,
  showEmoji,
}) => {
  const handleEmojiSelect = (emoji) => {
    setNewTextMsg(newTextMsg + emoji.native)
    setShowEmoji(!showEmoji)
  }

  return (
    <div className='absolute right-0 top-[-440px]'>
      <Picker data={data} set='emojione' onEmojiSelect={handleEmojiSelect} />
    </div>
  )
}

export default EmojiPickerComponent
