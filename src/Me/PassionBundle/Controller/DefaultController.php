<?php

namespace Me\PassionBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;

use Me\PassionBundle\Entity\User;
use Me\PassionBundle\Entity\Annonce;
use Symfony\Component\Security\Core\SecurityContextInterface;

class DefaultController extends Controller
{
    public function annoncesDataAction()
    {
        // get all annonces
    	$conn = $this->get('database_connection');
    	$entity = $conn->fetchAll(
    		'SELECT Annonce.`id`, `category_id`, `titre`, `texte`, `prix`, `photoPath`, `code_postal`, `ville`, `tel`, `valid`, 
    		DATE_FORMAT(Annonce.`dateCreated`, \'%d/%m/%Y\') AS date,
    		DATE_FORMAT(Annonce.`dateCreated`, \'%H:%i\') AS time,
    		Category.name AS category, 
    		User.email AS user
    		FROM Annonce 
    		INNER JOIN Category 
    		ON Annonce.category_id = Category.id
    		INNER JOIN User
    		ON Annonce.user_id = User.id
    		AND Annonce.valid = 1');

        // serialize and send to client
    	$serializedEntity = $this->container->get('serializer')->serialize($entity, 'json');
    	$response = new Response($serializedEntity);
    	$response->headers->set('Content-Type', 'application/json');

    	return $response;
    }

    public function categoriesDataAction()
    {
        // get all categories
        $conn = $this->get('database_connection');
        $entity = $conn->fetchAll(
            'SELECT * 
            FROM Category');

        // serialize and send to client
        $serializedEntity = $this->container->get('serializer')->serialize($entity, 'json');
        $response = new Response($serializedEntity);
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function submitAction(Request $request)
    {
        // get content of request
        $content = $this->get("request")->getContent();
        if (!$content){

            $params = json_decode($this->get("request")->get('form'));

            $em = $this->getDoctrine()->getManager();

            $user = $em->getRepository('MePassionBundle:User')->findOneByEmail($params->user->email);

            // if this is a new user, save to db
            if(!$user){
                $newUser = new User();
                $newUser->setEmail($params->user->email);
                $newUser->setPassword(password_hash($params->user->password, PASSWORD_BCRYPT));
                $newUser->setContact($params->user->contact);

                $em->persist($newUser);
                $em->flush();
            }
            // otherwise set password to password in request form
            else{
                $user->setPassword(password_hash($params->user->password, PASSWORD_BCRYPT));
            }

            // save new annonce
            $annonce = new Annonce();
            $detachedCategory = $this->container->get('serializer')->deserialize(json_encode($params->category), 'Me\PassionBundle\Entity\Category', 'json');
            $category = $em->merge($detachedCategory);
            $annonce->setCategory($category);
            $annonce->setTitre($params->titre);
            $annonce->setTexte($params->texte);
            $annonce->setPrix($params->prix);
            $annonce->setCodePostal($params->code);
            $annonce->setVille($params->ville);
            $annonce->setTel($params->tel);
            $validationCode = substr(md5(uniqid(mt_rand(), true)), 0, 8);
            $annonce->setValidationCode($validationCode);

            $annonce->setPhoto($this->get("request")->files->get('file'));

            // if user data is not already available, get new user and save to annonce
            if(!$user){
                $user = $em->getRepository('MePassionBundle:User')->findOneByEmail($params->user->email);
                $annonce->setUserId($user);
            }
            // otherwise get already available user data
            else{
                $annonce->setUserId($user);
            }

            // save to db
            $em->persist($annonce);
            $em->flush();

            // send validation email
            $annonce = $em->getRepository('MePassionBundle:Annonce')->findOneByValidationCode($validationCode);
            $link = "http://annonces.passionrunning.com/confirmer/".$annonce->getId()."/".$validationCode;
            $message = \Swift_Message::newInstance()
                ->setSubject("Confirmation d'annonce")
                ->setFrom("contact@passionrunning.com")
                ->setTo($params->user->email)
                ->setBody($this->renderView(
                    'MePassionBundle:Email:confirm.html.twig',
                        array('link' => $link)
                        ), 
                    'text/html');

            //$this->get('mailer')->send($message);

            $response = new Response('{"message": "Un email vous a été envoyé pour valider votre annonce"}');
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        }

        $response = new Response('{"message": "Votre annonce n\'a pas pu être traîtée"}');
        $response->headers->set('Content-Type', 'application/json');
        return $response;
    }

    public function respondAction(Request $request)
    {
        $content = $this->get("request")->getContent();

        if (!empty($content)){
            $params = json_decode($content);

            $em = $this->getDoctrine()->getManager();

            $annonce = $em->getRepository('MePassionBundle:Annonce')->findOneById($params->annonceId);
            $user = $em->getRepository('MePassionBundle:User')->findOneById($annonce->getUserId());

            $text = $params->text;
            $email = $params->email;

            $message = \Swift_Message::newInstance()
                ->setSubject("Message à propos de votre annonce")
                ->setFrom($email)
                ->setTo($user->getEmail())
                ->setBody($this->renderView(
                    'MePassionBundle:Email:message.html.twig',
                        array('text' => $text)
                        ), 
                    'text/html');

            //$this->get('mailer')->send($message);

            $response = new Response('{"message": "Votre message a été envoyé"}');
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        }

        $response = new Response('{"message": "Votre réponse n\'a pas pu être traîtée"}');
        $response->headers->set('Content-Type', 'application/json');
        return $response;
    }

    public function forgottenPasswordAction(Request $request)
    {
        $content = $this->get("request")->getContent();

        if(!empty($content)){
            $params = json_decode($content);

            $em = $this->getDoctrine()->getManager();
            $user = $em->getRepository('MePassionBundle:User')->findOneByEmail($params->email);

            if($user){
                $password = substr(md5(uniqid(mt_rand(), true)), 0, 8);
                $user->setPassword(password_hash($password, PASSWORD_BCRYPT));
                $em->flush();

                $message = \Swift_Message::newInstance()
                    ->setSubject("Message à propos de votre annonce")
                    ->setFrom("contact@passionrunning.com")
                    ->setTo($user->getEmail())
                    ->setBody($this->renderView(
                        'MePassionBundle:Email:password.html.twig',
                            array('password' => $password)
                            ),
                        'text/html');

                //$this->get('mailer')->send($message);

                $response = new Response('{"message": "Un email vous a été envoyé"}');
                $response->headers->set('Content-Type', 'application/json');
                return $response;
            }

            $response = new Response('{"message": "Votre adresse mail n\'a pas été trouvée"}');
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        }

        $response = new Response('{"message": "Votre réponse n\'a pas pu être traîtée"}');
        $response->headers->set('Content-Type', 'application/json');
        return $response;
    }

    public function confirmAction($id, $code)
    {
        $em = $this->getDoctrine()->getManager();
        $annonce = $em->getRepository('MePassionBundle:Annonce')->findOneById($id);
        if($annonce->getValidationCode() === $code){
            $annonce->setValid(true);
            $em->flush();
            return new RedirectResponse($this->generateUrl('me_passion_product',
                array('id' => $id)
            ));
        }
        // add error message here
        return new RedirectResponse($this->generateUrl('me_passion_homepage'));
    }

    public function indexAction(Request $request)
    {
        $session = $request->getSession();
        $user = $this->get('security.context')->getToken()->getUser();

        // get the login error if there is one
        if($request->attributes->has(SecurityContextInterface::AUTHENTICATION_ERROR)) {
            $error = $request->attributes->get(
                SecurityContextInterface::AUTHENTICATION_ERROR
            );
        }
        elseif(null !== $session && $session->has(SecurityContextInterface::AUTHENTICATION_ERROR)) {
            $error = $session->get(SecurityContextInterface::AUTHENTICATION_ERROR);
            $session->remove(SecurityContextInterface::AUTHENTICATION_ERROR);
        }
        else{
            $error = '';
        }

        // last username entered by the user
        $lastUsername = (null === $session) ? '' : $session->get(SecurityContextInterface::LAST_USERNAME);

        return $this->render(
            'MePassionBundle:Default:index.html.twig',
            array(
                // last username entered by the user
                'last_username' => $lastUsername,
                'error'         => $error,
                'user'          => $user
            )
        );
    }

    // password protected area

    public function modifyAction()
    {
        $user = $this->get('security.context')->getToken()->getUser();

        // get content of request
        $content = $this->get("request")->getContent();
        if (!$content){

            $params = json_decode($this->get("request")->get('form'));

            $em = $this->getDoctrine()->getManager();

            $annonce = $em->getRepository('MePassionBundle:Annonce')->findOneById($params->id);

            if($annonce->getUserId() == $user){
                // if category is an object, deserialize and merge; else find matching category
                if(gettype($params->category) == "object"){
                    $detachedCategory = $this->container->get('serializer')->deserialize(json_encode($params->category), 'Me\PassionBundle\Entity\Category', 'json');
                    $category = $em->merge($detachedCategory);
                }
                else{
                    $category = $em->getRepository('MePassionBundle:Category')->findOneById($params->category);
                }

                // set category and other params
                $annonce->setCategory($category);
                $annonce->setTitre($params->titre);
                $annonce->setTexte($params->texte);
                $annonce->setPrix($params->prix);
                $annonce->setCodePostal($params->code);
                $annonce->setVille($params->ville);
                $annonce->setTel($params->tel);

                // if photo is modified, set new photo
                if($this->get("request")->files->get('file')){
                    $annonce->setPhoto($this->get("request")->files->get('file'));
                }

                $em->flush();

                $response = new Response('{"message": "Votre annonce a été modifiée"}');
                $response->headers->set('Content-Type', 'application/json');
                return $response;
            }

            $response = new Response('{"message": "Vous devez vous connecter pour effectuer cette action"}');
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        }

        $response = new Response('{"message": "Vos modifications n\'ont pas pu être traîtées"}');
        $response->headers->set('Content-Type', 'application/json');
        return $response;
    }

    public function deleteAction($id)
    {
        $user = $this->get('security.context')->getToken()->getUser();

        $em = $this->getDoctrine()->getManager();

        $annonce = $em->getRepository('MePassionBundle:Annonce')->findOneById($id);

        if($annonce->getUserId() == $user){
            $em->remove($annonce);
            $em->flush();

            $response = new Response('{"message": "Votre annonce a été supprimée"}');
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        }

        $response = new Response('{"message": "Vous devez vous connecter pour effectuer cette action"}');
        $response->headers->set('Content-Type', 'application/json');
        return $response;
    }
}
