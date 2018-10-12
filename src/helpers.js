import MutationObserver from '@sheerun/mutationobserver-shim'

function newMutationObserver(onMutation) {
  const MutationObserverConstructor =
    typeof window !== 'undefined' &&
    typeof window.MutationObserver !== 'undefined'
      ? window.MutationObserver
      : MutationObserver

  return new MutationObserverConstructor(onMutation)
}

function getDocument() {
  if (typeof window === 'undefined') {
    throw new Error('Could not find default container')
  }
  return window.document
}

export {getDocument, newMutationObserver}
