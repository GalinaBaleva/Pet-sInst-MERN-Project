import { useEffect, useState } from 'react';
import './PostForm.css';
import { useNavigate } from 'react-router-dom';

const PostForm = (props) => {
  const [textFields, setTextFields] = useState({
    name: '',
    image: null,
    description: '',
  });
  const [spinner, setSpinner] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (props.name && props.description) {
      setTextFields({ ...textFields, name: props.name, description: props.description })
    }
  }, [props]);

  const navigate = useNavigate();

  const changeHandler = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setTextFields({ ...textFields, image: files[0] });
    } else {
      setTextFields({ ...textFields, [name]: value });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setSpinner(true);
    setError('');

    const formData = new FormData();
    formData.append('name', textFields.name);
    formData.append('description', textFields.description);
    if (textFields.image) {
      formData.append('image', textFields.image);
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + props.path, {
        credentials: 'include',
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setSpinner(false);

      if (!response.ok) {
        setError(result.message || result.error || 'Something went wrong');
        return;
      }

      navigate('/catalog');

    } catch (err) {
      setSpinner(false);
      console.error('Error uploading:', err);
      setError('Network error, please try again');
    }
  };

  return (
    <>
      {spinner
        ? <div>Loading...</div>
        :
        <form className="create-edite-form" onSubmit={submitHandler}>
          <fieldset name="fieldset">
            <legend>{props.legend}</legend>
            <div className="input-wrapper">
              <input
                type="text"
                name="name"
                value={textFields.name}
                placeholder="Pet's name..."
                onChange={changeHandler}
                required
              />
            </div>
            <div className="input-wrapper">
              <input
                type="file"
                name="image"
                onChange={changeHandler}
                required={props.action !== 'edit'}
              />
            </div>
            <textarea
              name="description"
              placeholder="Description..."
              value={textFields.description}
              onChange={changeHandler}
              required
            />
            {error && <p style={{ color: 'red', margin: '8px 0 0' }}>{error}</p>}
            <button className="auth-form-button" type="submit">
              {props.button}
            </button>
          </fieldset>
        </form>
      }
    </>
  );
};

export default PostForm;
