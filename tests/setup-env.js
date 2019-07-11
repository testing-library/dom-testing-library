import 'jest-dom/extend-expect'
import jestSerializerAnsi from 'jest-serializer-ansi'

expect.addSnapshotSerializer(jestSerializerAnsi)

// Make sure that our tests do the use fakeTimer mock:
// https://github.com/testing-library/dom-testing-library/issues/300
global.useFakeTimers = true