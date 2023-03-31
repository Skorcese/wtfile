import { Title, Button, Content, Container } from './App.styles';

export const App = () => {
  return (
    <Container>
      <Title>WTFile?</Title>
      <Content>So, you know a bit about computers...</Content>
      <Content>
        Probably seen, opened, created and deleted a bunch of files along your
        journey.
      </Content>
      <Content>
        Are you brave enough to recognize their extension based on file's
        content?
      </Content>
      <Content>
        Below lies a button that begins a quiz consisting of 10 questions.
      </Content>
      <Content>
        You'll see the file's name, what it consists of. There are four options
        to pick from.
      </Content>
      <Content>Can you guess them all correctly?</Content>
      <Button to="/quiz">Bring it on</Button>
    </Container>
  );
};

export default App;
