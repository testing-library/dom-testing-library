import '@testing-library/jest-dom/extend-expect'
import jestSerializerAnsi from 'jest-serializer-ansi'

expect.addSnapshotSerializer(jestSerializerAnsi)
