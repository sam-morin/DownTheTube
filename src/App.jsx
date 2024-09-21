import React, { useState } from 'react';
import './App.css';
import ReactTimeAgo from 'react-time-ago'
import logo from './assets/play-button-4210.svg';
import DOMPurify from 'dompurify';

// mantine imports
import '@mantine/core/styles.css';
import { notifications, Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { 
  ActionIcon, 
  Button, 
  Card, 
  Center, 
  Checkbox, 
  Group, 
  MantineProvider, 
  Select, 
  TextInput, 
  Text, 
  Stack, 
  Spoiler, 
  Tooltip, 
  Grid,
  useMantineColorScheme,
} from '@mantine/core';

// icon imports
import { 
  IconDownload, 
  IconCheck, 
  IconX, 
  IconSearch, 
  IconMoonStars, 
  IconSun, 
  IconTrash, 
  IconPlayerPlayFilled 
} from '@tabler/icons-react';


const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log(backendUrl)

function App() {
    const [url, setUrl] = useState('');
    const [videoInfo, setVideoInfo] = useState({});
    const [download_to_browser_also, setDownload_to_browser_also] = useState(false);
    const [desiredResolution, setDesiredResolution] = useState();

    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    const handleDownload = async () => {
        const id = notifications.show({
          loading: true,
          title: 'Downloading video...',
          message: `Well I don't need to tell you that, the larger the video, the longer it'll take.. But I just did.`,
          autoClose: false,
          withCloseButton: false,
          position: 'bottom-left',
        });
        // handle download to server
        try {
            const response = await fetch(`${backendUrl}/download`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, download_to_browser_also: download_to_browser_also, desired_resolution: desiredResolution }),
            });

            const contentType = response.headers.get('Content-Type');

            if (contentType && contentType.includes('application/json')) {
                // handle file download to server response
                const data = await response.json();
                // console.log(data.message);
                notifications.update({
                  id,
                  color: 'teal',
                  title: 'Wooohoo!',
                  message: 'The video has been processed and downloaded successfully to the server.',
                  icon: <IconCheck style={{ width: 18, height: 18 }} />,
                  loading: false,
                  autoClose: 2000,
                });
            } else if (contentType && contentType.includes('video/mp4')) {
                // handle file download to browser also
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                const safeTitle = DOMPurify.sanitize(videoInfo.title);
                a.href = DOMPurify.sanitize(url);
                a.download = `${safeTitle}.mp4`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
                notifications.update({
                  id,
                  color: 'teal',
                  title: 'Wooohoo!',
                  message: 'The video has been processed and downloaded successfully to the server and to your browser.',
                  icon: <IconCheck style={{ width: 18, height: 18 }} />,
                  loading: false,
                  autoClose: 2000,
                });
            } else {
                // handle other response types or errors
                console.error('Unexpected response type:', contentType);
                notifications.update({
                  id,
                  color: 'red',
                  title: 'Oh no!',
                  message: 'Unexpected response type: ' + contentType,
                  icon: <IconX style={{ width: 18, height: 18 }} />,
                  loading: false,
                  autoClose: 2000,
                });
            }
        } catch (error) {
            console.log(error)
            notifications.update({
              id,
              color: 'red',
              title: 'Oh no!',
              message: error.message,
              icon: <IconX style={{ width: 18, height: 18 }} />,
              loading: false,
              autoClose: 2000,
            });
        }
    };

    const handleGetVideo = async () => {
        const id = notifications.show({
          loading: true,
          title: 'Loading video info...',
          message: 'Just give it a few seconds!',
          autoClose: false,
          withCloseButton: false,
          position: 'bottom-left',
        });
        if (!url) {
            notifications.update({
              id,
              color: 'red',
              title: 'Oh no!',
              message: "Yo lol you need to fill out the URL first.",
              icon: <IconX style={{ width: 18, height: 18 }} />,
              loading: false,
              autoClose: 2000,
            });
            return;
        }
        try {
            const response = await fetch(`${backendUrl}/info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });
            
            const data = await response.json();
            // console.log(data)
            setVideoInfo(data);
            if (data.error) {
                notifications.update({
                  id,
                  color: 'red',
                  title: 'Oh no!',
                  message: data.error,
                  icon: <IconX style={{ width: 18, height: 18 }} />,
                  loading: false,
                  autoClose: 2000,
                });
                return;
            } else {
              notifications.update({
                id,
                color: 'teal',
                title: 'Success!',
                message: 'We got that video data.',
                icon: <IconCheck style={{ width: 18, height: 18 }} />,
                loading: false,
                autoClose: 2000,
              });
            }
        } catch (error) {
            console.log(error)
            notifications.update({
              id,
              color: 'red',
              title: 'Oh no!',
              message: error.message,
              icon: <IconX style={{ width: 18, height: 18 }} />,
              loading: false,
              autoClose: 2000,
            });
        }
    };

    const handleClearVideo = () => {
        setUrl('');
        setVideoInfo({});
    };

    function formatTime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
  
      let timeString = '';
  
      if (hours > 0) {
          timeString += `${hours} hr `;
      }
  
      if (minutes > 0 || hours > 0) {
          timeString += `${minutes} min `;
      }
  
      timeString += `${remainingSeconds} sec`;
  
      return timeString.trim();
    }

    function formatDate(dateString) {
      const date = new Date(dateString);
  
      const options = { 
          year: 'numeric', 
          month: 'numeric', 
          day: 'numeric' 
      };
  
      const timeOptions = {
          hour: 'numeric', 
          minute: 'numeric', 
          hour12: true
      };
  
      const formattedDate = date.toLocaleDateString('en-US', options);
      const formattedTime = date.toLocaleTimeString('en-US', timeOptions).replace(' ', '');
  
      return `${formattedDate} at ${formattedTime}`;
    }

    const VideoResolutionSelect = ({ videoStreams }) => {    
      const data = Object.entries(videoStreams).map(([resolution, itag]) => ({
        value: itag.toString(),
        label: resolution,
      }));
    
      return (
        <Select
          data={data}
          value={desiredResolution}
          onChange={(selectedValue) => {
            setDesiredResolution(selectedValue);
          }}
          placeholder="Select resolution"
          searchable
          clearable
          description="Select the resolution you want to download"
          w={"100%"}
          size='lg'
        />
      );
    };

    return (
      <MantineProvider defaultColorScheme="dark">
        <Notifications />
          <>
            <Grid>
              <Grid.Col span={{ base: 12, md: videoInfo.message === "Retrieved info successfully." ? 6 : 12, lg: videoInfo.message === "Retrieved info successfully." ? 6 : 12 }}>
                <Center style={{ height: '90vh' }}>
                  <Card shadow="sm" padding="lg" radius="md" w={500}  bg={dark ? 'dark.8' : 'gray.3'}>
                    <Center>
                      <Tooltip label="Down those tubes!" withArrow>
                        {/* <IconPlayerPlayFilled color='#ff3838' size={144} /> */}
                        <img src={logo} width={144} height={144} alt="DownTheTube Logo" />
                        {/* <Image src={logo} width={144} height={144} alt="DownTheTube Logo" /> */}
                      </Tooltip>
                    </Center>
                    <br/>
                    <Group justify='space-between' align='center'>
                      <Stack>
                        <Text size={"2.5rem"} className='title'><b>DownTheTube</b></Text>
                        {/* <Text size={"12px"} style={{ marginTop: '-20px' }}>from smorin</Text> */}
                      </Stack>
                      <ActionIcon
                        variant="subtle"
                        color={dark ? 'yellow' : 'blue'}
                        onClick={() => toggleColorScheme()}
                        title="Toggle color scheme"
                        size={"42px"}
                        className='theme-button'
                      >
                        {dark ? <IconSun size={"52px"} /> : <IconMoonStars size={"52px"} />}
                      </ActionIcon>
                    </Group>

                    <br/>

                    <TextInput
                        type="text"
                        size="lg"
                        rightSection={(
                          videoInfo.message === "Retrieved info successfully." ? (
                            <Tooltip label="Clear" withArrow>
                              <ActionIcon
                                color={'red'}
                                onClick={handleClearVideo}
                                size={38}
                                variant="subtle"
                              >
                                <IconTrash size={25} />
                              </ActionIcon>
                            </Tooltip>
                          ) : (
                            <ActionIcon
                              color={url ? 'teal' : 'grey'}
                              onClick={handleGetVideo}
                              size={38}
                              variant="subtle"
                            >
                              <IconSearch size={16} />
                            </ActionIcon>
                          )
                        )}
                        description="Enter a YouTube video URL to query"
                        placeholder="https://www.youtube.com/watch?v=xvFZjo5PgG0"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        w={"100%"}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                              handleGetVideo();
                          }
                      }}
                    />
                    {videoInfo.message === "Retrieved info successfully." && (
                      <>
                        <br/>
                        
                        <Group position="center">
                          <VideoResolutionSelect videoStreams={videoInfo.video_streams} />
                          <Checkbox 
                            label="Download to the browser and server" 
                            checked={download_to_browser_also} 
                            onChange={(e) => setDownload_to_browser_also(e.currentTarget.checked)} 
                            size='lg'
                            // color='#63A715'
                            color='#ff3838'
                          />
                          <Button 
                            // variant='gradient' 
                            // variant='default'  
                            onClick={handleDownload} 
                            disabled={!desiredResolution} 
                            fullWidth 
                            size='lg'
                            // color='teal'
                            color='#ff3838'
                            // color={download_to_browser_also ? 'teal' : 'blue'}
                            rightSection={<IconDownload />}
                            // gradient={{ from: 'lime', to: 'teal', deg: 81 }}

                          >
                            {download_to_browser_also ? 'Download' : 'Download to server'}
                          </Button>
                        </Group>
                      </>
                    )}
                  </Card>
                </Center>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              {videoInfo.message === "Retrieved info successfully." && (
                <Center>
                  <Card shadow="sm" padding="lg" radius="md" w={500}  bg={dark ? 'dark.8' : 'gray.3'}>
                      <Center>
                        <div className="thumbnail-container" style={{cursor: 'pointer'}} onClick={() => window.open(videoInfo.url, '_blank')}>
                          {/* <Tooltip label="Open in new tab" position='bottom-end' withArrow> */}
                            <img src={DOMPurify.sanitize(videoInfo.thumbnail_url)} width={300} alt="Thumbnail" />
                          {/* </Tooltip> */}
                        </div>
                      </Center>
                      <Text onClick={() => window.open(videoInfo.url, '_blank')} order={2} style={{paddingTop: '20px', cursor: 'pointer', fontSize: '28px', fontWeight: 'bold'}}>{DOMPurify.sanitize(videoInfo.title)}</Text>
                      <br/>
                      <Group justify='space-between'>
                        <Stack gap={0}>
                          <Text color="dimmed">Author</Text>
                          <Text size={"24px"} onClick={() => window.open(videoInfo.channel_url, '_blank')} style={{cursor: 'pointer'}}>{videoInfo.author}</Text>
                        </Stack>
                        <Stack gap={0}>
                          <Text style={{display: 'flex', justifyContent: 'flex-end'}} color="dimmed">Views</Text>
                          <Text size={"24px"}>{videoInfo.views.toLocaleString()}</Text>
                        </Stack>
                      </Group>
                      <br/>
                      <Group justify='space-between'>
                        <Stack gap={0}>
                          <Text color="dimmed">Length</Text>
                          <Text size={"24px"}>{formatTime(videoInfo.length)}</Text>
                        </Stack>
                        <Stack gap={0}>
                          <Text style={{display: 'flex', justifyContent: 'flex-end'}} color="dimmed">Uploaded&nbsp; <ReactTimeAgo date={new Date(videoInfo.publish_date)} locale="en-US"/></Text>
                          <Text size={"24px"}>{formatDate(videoInfo.publish_date)}</Text>
                        </Stack>
                      </Group>
                      <br/>
                      <Text color="dimmed">Description</Text>
                      <Spoiler maxHeight={50} showLabel="Show more" hideLabel="Hide">
                        <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'Arial', fontSize: '16px' }}>{videoInfo.description}</pre>
                      </Spoiler>
                  </Card>
                </Center>
                )}
              </Grid.Col>
            </Grid>
          </>
      </MantineProvider>
    );
}

export default App;
