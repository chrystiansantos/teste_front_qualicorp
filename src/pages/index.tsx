import type { NextPage } from 'next'
import { Box, Button, Container, Flex, FormControl, FormLabel, Image as ImageChackra, Input, Select, Stack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { api } from '../service/api'
import { apiStateCity } from '../service/apiStateCIty'
import { FiSearch } from 'react-icons/fi'
import ReactLoading from 'react-loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface IResponseAddress {
  CIDADE_NOME: string;
  ESTADO_NOME: string;
  ESTADO_SIGLA: string;
}

interface IStateList {
  ESTADO_NOME: string;
  ESTADO_SIGLA: string;
}[]

interface IStateListResponse {
  name: string;
  state_code: string
}

interface iResponseWork {
  profissao: string
}[];

interface IResponseEntity {
  RazaoSocial: string;
  NomeFantasia: string;
}[];

const notify = () => toast.error('Ocorreu um erro, tente novamente mais tarde  🙁');

const Home: NextPage = () => {


  const [zipCode, setZipCode] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [work, setWork] = useState('');
  const [entity, setEntity] = useState('');
  const [loading, setLoading] = useState<boolean>(false);


  const [stateList, setStateList] = useState<IStateList[]>([]);
  const [citieList, setCitiesList] = useState<string[]>([]);
  const [worksList, setWorksList] = useState<iResponseWork[]>([]);
  const [entityList, setEntityList] = useState<IResponseEntity[]>([]);


  const submit = () => {
    const entityFind = entityList.find(el => el.RazaoSocial === entity)
    console.log({
      entidade: entityFind?.NomeFantasia,
      uf: state,
      cidade: city,
      dataNascimento: [
        "2021-01-01",
        "2022-01-01",
      ]
    })
  }

  useEffect(() => {
    async function getState() {
      setLoading(true)
      try {
        const { data } = await apiStateCity.post('/countries/states', {
          "country": "Brazil"
        })
        const statesFormatted = data.data.states.map((el: IStateListResponse) => ({
          ESTADO_NOME: el.name,
          ESTADO_SIGLA: el.state_code
        }))
        setStateList(statesFormatted);
        setLoading(false)
      } catch (error) {
        setLoading(false)
        notify()
      }
    }

    getState()
  }, [])

  useEffect(() => {

    async function getCity() {
      setLoading(true)
      try {
        if (state) {
          const { data } = await apiStateCity.post('/countries/state/cities', {
            "country": "Brazil",
            "state": state
          })
          setCitiesList(data.data);
          setLoading(false)
        }
      } catch (error) {
        setLoading(true)
        notify()
      }
    }
    getCity();
  }, [state])

  useEffect(() => {
    async function buscarEndereco() {
      setLoading(true)
      try {
        if (zipCode.length === 8) {
          const { data } = await api.get<IResponseAddress>(`endereco/Enderecos/${zipCode}?api-key=92344d33-65ee-4a33-a3a2-a1fb7fcd65a7`)
          if (data.ESTADO_NOME && data.CIDADE_NOME) {
            setState(data.ESTADO_NOME);
            setCity(data.CIDADE_NOME);
          }
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }
    buscarEndereco();
  }, [zipCode])

  useEffect(() => {
    setLoading(true)
    async function getProfissao() {
      try {
        if (state && city) {
          const stateSelect = stateList.find(el => el.ESTADO_NOME === state);
          const { data } = await api.get<iResponseWork[]>(`profissao/${stateSelect?.ESTADO_SIGLA}/${city}?api-key=eebc059d-6838-4762-8e28-d2f726753866`)
          setWorksList(data);
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
        notify()
      }
    }
    getProfissao();
  }, [state, city])

  useEffect(() => {
    setLoading(true)
    async function getEntidade() {
      try {
        if (work && city && state) {
          const stateSelect = stateList.find(el => el.ESTADO_NOME === state);
          const { data } = await api.get<IResponseEntity[]>(`/entidade/${work}/${stateSelect?.ESTADO_SIGLA}/${city}?api-key=f1e6c49a-ca38-45d7-984a-616ff4fb458a`)
          setEntityList(data)
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
        notify()
      }
    }
    getEntidade()
  }, [work, city, state])

  return (
    <Container mt="180" maxWidth="container.lg">
      <ToastContainer />
      <Stack direction={["row"]}>
        <Box w='30%' h='400px' display="flex" alignItems="center" justifyContent="center" bg='bgColor.100'>
          <ImageChackra src="https://www.qualicorp.com.br/wp-content/uploads/2021/08/cropped-Logo_HomeQuali.png"></ImageChackra>
        </Box>
        <Box w='70%' h='400px' bg='#eee' borderRadius={16}>
          <FormControl bgColor="#ddd" m={4} w="47%">
            <Input placeholder='Cep' maxLength={8} value={zipCode} onChange={e => setZipCode(e.target.value)} />
          </FormControl>

          <Stack direction="row" mx={4}>
            <FormControl bgColor="#ddd" width="50%">
              <Select placeholder='Estado' value={state} onChange={e => setState(e.target.value)}>
                {stateList.map(el => (<option key={el.ESTADO_SIGLA} value={el.ESTADO_NOME}>{el.ESTADO_NOME}</option>))}
              </Select>
            </FormControl>
            <FormControl bgColor="#ddd" width="50%">
              <Select placeholder='Cidade' value={city} onChange={e => setCity(e.target.value)}>
                {citieList.map(el => (<option key={el} value={el}>{el}</option>))}
              </Select>
            </FormControl>
          </Stack>

          <Stack direction="row" mx={4} my={4}>
            <FormControl bgColor="#ddd" width="50%">
              <Select placeholder='Profissão' value={work} onChange={e => setWork(e.target.value)} >
                {worksList.map(el => (<option key={el.profissao} value={el.profissao}>{el.profissao}</option>))}
              </Select>
            </FormControl>
            <FormControl bgColor="#ddd" width="50%">
              <Select placeholder='Entidade' value={entity} onChange={e => setEntity(e.target.value)}>
                {entityList.map(el => (<option key={el.RazaoSocial} value={el.RazaoSocial}>{el.RazaoSocial}</option>))}
              </Select>
            </FormControl>
          </Stack>

          <Stack>
            <Button colorScheme='blue' rightIcon={<FiSearch />} variant='solid' onClick={submit}>
              Buscar Planos
            </Button>
          </Stack>
          {loading && (
            <Stack display="flex" alignItems="center" justifyContent="center" height="100px">
              <ReactLoading type="bubbles" color={"#212529"} height={60} width={60} />
            </Stack>
          )}

        </Box>
      </Stack >
    </Container >
  )
}

export default Home;
