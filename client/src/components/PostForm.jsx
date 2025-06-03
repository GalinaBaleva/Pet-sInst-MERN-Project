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

    const formData = new FormData();
    formData.append('name', textFields.name);
    formData.append('description', textFields.description);
    formData.append('image', textFields.image);

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + props.path, {
        credentials: 'include',
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setSpinner(false);
      navigate('/catalog');

    } catch (err) {
      setSpinner(false);
      console.error('Error uploading:', err);
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
                required
              />
            </div>
            <textarea
              name="description"
              placeholder="Description..."
              value={textFields.description}
              onChange={changeHandler}
              required
            />
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
